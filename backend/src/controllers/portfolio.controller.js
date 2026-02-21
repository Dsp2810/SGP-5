const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const Portfolio = require('../models/Portfolio');
const { spawn } = require('child_process');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from DOCX file
 */
const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from uploaded file based on type
 */
const extractTextFromFile = async (file) => {
  const fileBuffer = file.buffer;
  const fileType = file.mimetype;

  if (fileType === 'application/pdf') {
    return await extractTextFromPDF(fileBuffer);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    return await extractTextFromDOCX(fileBuffer);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX files only.');
  }
};

/**
 * Extract portfolio data using Surya OCR (Python script)
 * This is the primary and only extraction method for portfolio generation
 * Handles scanned PDFs, images, and text-based PDFs
 */
const extractPortfolioDataWithOCR = async (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../services/resumeOCR.py');
    
    // Spawn Python process
    const pythonCmd = process.env.PYTHON_PATH || 'C:/Users/HP/AppData/Local/GitHubDesktop/SGP-5/.venv/Scripts/python.exe';
    const pythonProcess = spawn(pythonCmd, [pythonScript, filePath]);
    
    let dataString = '';
    let errorString = '';
    
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    let timeoutHandle;
    
    pythonProcess.on('close', (code) => {
      clearTimeout(timeoutHandle);
      if (code !== 0) {
        console.error('Surya OCR Error (exit code ' + code + '):\n' + errorString);
        return resolve(null);
      }
      
      if (errorString) {
        console.log('Surya OCR stderr (warnings):\n' + errorString);
      }
      
      try {
        // Find the last JSON object in stdout (ignore progress/warning lines)
        const jsonMatch = dataString.match(/(\{[\s\S]*\})\s*$/);
        if (!jsonMatch) {
          console.error('No JSON in OCR output. stdout:', dataString.substring(0, 500));
          return resolve(null);
        }
        const result = JSON.parse(jsonMatch[1]);
        if (result.success) {
          console.log('Surya OCR extraction successful!');
          resolve(result.data);
        } else {
          console.error('Surya OCR failed:', result.error);
          resolve(null);
        }
      } catch (error) {
        console.error('Failed to parse Surya OCR output:', error.message);
        console.error('Raw stdout:', dataString.substring(0, 500));
        resolve(null);
      }
    });
    
    // Set timeout for OCR process (10 min to allow model download on first run)
    timeoutHandle = setTimeout(() => {
      pythonProcess.kill();
      console.error('Surya OCR timeout after 10 minutes');
      resolve(null);
    }, 600000);
  });
};

/**
 * Parse resume and extract portfolio details using Surya OCR only
 */
exports.parseResume = async (req, res) => {
  let tempFilePath = null;
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (PDF, DOCX, or image)'
      });
    }

    console.log('ðŸ” Extracting portfolio data using Surya OCR...');
    
    // Save file temporarily for OCR processing
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });
    tempFilePath = path.join(tempDir, `${Date.now()}_${req.file.originalname}`);
    await fs.writeFile(tempFilePath, req.file.buffer);
    
    // Use Surya OCR for all file types
    const portfolioData = await extractPortfolioDataWithOCR(tempFilePath);

    if (!portfolioData) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract data from resume. Please ensure the file is readable and contains standard resume sections (Education, Experience, Skills, etc.).'
      });
    }

    // Clean up temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: portfolioData
    });
  } catch (error) {
    console.error('Resume parsing error:', error);
    
    // Clean up temporary file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to parse resume',
      error: error.message
    });
  }
};

/**
 * Deploy portfolio - Save to MongoDB and return link
 */
exports.deployPortfolio = async (req, res) => {
  try {
    const { portfolioData, template } = req.body;
    const userId = req.user.id;

    // Validate required data
    if (!portfolioData || !portfolioData.name || !portfolioData.title) {
      return res.status(400).json({
        success: false,
        message: 'Portfolio name and title are required'
      });
    }

    // Generate unique portfolio ID
    const portfolioId = uuidv4().split('-')[0];
    
    // Upload profile photo to Cloudinary if provided
    let profilePhotoUrl = '';
    if (portfolioData.profilePhoto) {
      try {
        const uploadResult = await cloudinary.uploader.upload(portfolioData.profilePhoto, {
          folder: 'placify/portfolios',
          public_id: `${userId}_${portfolioId}_profile`
        });
        profilePhotoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    }

    // Create portfolio document in MongoDB
    const portfolio = await Portfolio.create({
      userId,
      portfolioId,
      template: template || 'template1',
      personalInfo: {
        name: portfolioData.name,
        title: portfolioData.title,
        email: portfolioData.email || '',
        phone: portfolioData.phone || '',
        location: portfolioData.location || '',
        about: portfolioData.about || '',
        github: portfolioData.github || '',
        linkedin: portfolioData.linkedin || '',
        portfolio: portfolioData.portfolio || '',
        profilePhoto: profilePhotoUrl
      },
      experience: portfolioData.experience || [],
      education: portfolioData.education || [],
      skills: portfolioData.skills || [],
      projects: portfolioData.projects || [],
      certifications: portfolioData.certifications || [],
      achievements: portfolioData.achievements || []
    });

    // Generate portfolio URL
    const portfolioUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/p/${portfolioId}`;

    res.json({
      success: true,
      message: 'Portfolio deployed successfully',
      portfolioUrl,
      portfolioId,
      portfolio
    });
  } catch (error) {
    console.error('Portfolio deployment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deploy portfolio',
      error: error.message
    });
  }
};

/**
 * Get portfolio by ID (for public viewing)
 */
exports.getPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const portfolio = await Portfolio.findOne({ portfolioId, isPublished: true });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Increment view count
    portfolio.views += 1;
    await portfolio.save();

    res.json({
      success: true,
      portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message
    });
  }
};


/**
 * Get user's portfolios
 */
exports.getUserPortfolios = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolios = await Portfolio.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      portfolios
    });
  } catch (error) {
    console.error('Get user portfolios error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolios',
      error: error.message
    });
  }
};

/**
 * Update portfolio
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { portfolioData, template } = req.body;
    const userId = req.user.id;

    const portfolio = await Portfolio.findOne({ portfolioId, userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Update portfolio data
    if (template) portfolio.template = template;
    if (portfolioData) {
      if (portfolioData.name) portfolio.personalInfo.name = portfolioData.name;
      if (portfolioData.title) portfolio.personalInfo.title = portfolioData.title;
      if (portfolioData.email !== undefined) portfolio.personalInfo.email = portfolioData.email;
      if (portfolioData.phone !== undefined) portfolio.personalInfo.phone = portfolioData.phone;
      if (portfolioData.location !== undefined) portfolio.personalInfo.location = portfolioData.location;
      if (portfolioData.about !== undefined) portfolio.personalInfo.about = portfolioData.about;
      if (portfolioData.github !== undefined) portfolio.personalInfo.github = portfolioData.github;
      if (portfolioData.linkedin !== undefined) portfolio.personalInfo.linkedin = portfolioData.linkedin;
      if (portfolioData.experience !== undefined) portfolio.experience = portfolioData.experience;
      if (portfolioData.education !== undefined) portfolio.education = portfolioData.education;
      if (portfolioData.skills !== undefined) portfolio.skills = portfolioData.skills;
      if (portfolioData.projects !== undefined) portfolio.projects = portfolioData.projects;
      if (portfolioData.certifications !== undefined) portfolio.certifications = portfolioData.certifications;
      if (portfolioData.achievements !== undefined) portfolio.achievements = portfolioData.achievements;
    }

    await portfolio.save();

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      portfolio
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio',
      error: error.message
    });
  }
};

/**
 * Delete portfolio
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.id;

    const portfolio = await Portfolio.findOneAndDelete({ portfolioId, userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio',
      error: error.message
    });
  }
};

/**
 * Generate portfolio HTML
 */
function generatePortfolioHTML(data, template) {
  // This is a simple template - in production, you'd use the actual template components
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; }
        h1 { font-size: 2.5em; margin-bottom: 10px; }
        .title { font-size: 1.3em; opacity: 0.9; }
        .contact { margin: 20px 0; }
        .contact a { color: white; text-decoration: none; margin: 0 10px; }
        section { margin: 40px 0; }
        h2 { color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
        .about { font-size: 1.1em; line-height: 1.8; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #f0f0f0; padding: 8px 16px; border-radius: 20px; }
        .experience-item, .education-item, .project-item { margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .experience-item h3, .project-item h3 { color: #333; margin-bottom: 5px; }
        .duration, .year { color: #666; font-size: 0.9em; }
        footer { text-align: center; padding: 30px; background: #f0f0f0; margin-top: 60px; }
    </style>
</head>
<body>
    <header>
        <h1>${data.name}</h1>
        <p class="title">${data.title}</p>
        <div class="contact">
            ${data.email ? `<a href="mailto:${data.email}">ðŸ“§ ${data.email}</a>` : ''}
            ${data.phone ? `<span>ðŸ“± ${data.phone}</span>` : ''}
            ${data.location ? `<span>ðŸ“ ${data.location}</span>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank">ðŸ’» GitHub</a>` : ''}
        </div>
    </header>

    <div class="container">
        ${data.about ? `
        <section>
            <h2>About Me</h2>
            <p class="about">${data.about}</p>
        </section>
        ` : ''}

        ${data.skills && data.skills.length > 0 ? `
        <section>
            <h2>Skills</h2>
            <div class="skills">
                ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </section>
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
        <section>
            <h2>Experience</h2>
            ${data.experience.map(exp => `
                <div class="experience-item">
                    <h3>${exp.position}${exp.company ? ` at ${exp.company}` : ''}</h3>
                    ${exp.duration ? `<p class="duration">${exp.duration}</p>` : ''}
                    ${exp.description ? `<p>${exp.description}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section>
            <h2>Projects</h2>
            ${data.projects.map(proj => `
                <div class="project-item">
                    <h3>${proj.name}</h3>
                    ${proj.description ? `<p>${proj.description}</p>` : ''}
                    ${proj.technologies && proj.technologies.length > 0 ? `
                        <div class="skills">
                            ${proj.technologies.map(tech => `<span class="skill">${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${proj.link ? `<a href="${proj.link}" target="_blank">View Project â†’</a>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}

        ${data.education && data.education.length > 0 ? `
        <section>
            <h2>Education</h2>
            ${data.education.map(edu => `
                <div class="education-item">
                    <h3>${edu.degree}</h3>
                    <p>${edu.institution}</p>
                    ${edu.year ? `<p class="year">${edu.year}</p>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}
    </div>

    <footer>
        <p>Â© ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
        <p>Built with Placify Portfolio Generator</p>
    </footer>
</body>
</html>`;
}
