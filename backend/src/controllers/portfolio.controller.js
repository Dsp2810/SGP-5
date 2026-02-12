const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const Portfolio = require('../models/Portfolio');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

// Hugging Face Configuration
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"; // Updated to v0.3

/**
 * Call Hugging Face Inference API
 */
async function queryHuggingFace(prompt) {
  if (!HF_TOKEN || HF_TOKEN === 'your_huggingface_token_here') {
    console.log('⚠️ HF_TOKEN not configured, skipping AI extraction');
    return null;
  }

  try {
    // Use Text Generation Inference endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
          'x-wait-for-model': 'true' // Wait for model to load
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.1,
            return_full_text: false,
            do_sample: false
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`HF API Error (${response.status}):`, errorText);
      
      // Check if model is loading
      if (response.status === 503) {
        console.log('⏳ Model is loading, will use regex fallback for now');
      }
      return null;
    }

    const result = await response.json();

    // Handle different response formats
    if (Array.isArray(result) && result[0]?.generated_text) {
      return result[0].generated_text;
    }

    if (result.generated_text) {
      return result.generated_text;
    }

    if (result[0]?.generated_text) {
      return result[0].generated_text;
    }

    if (result.error) {
      console.log("HF Model Error:", result.error);
      return null;
    }

    console.log('⚠️ Unexpected response format:', JSON.stringify(result).substring(0, 200));
    return null;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏱️ HF API timeout after 30 seconds');
    } else {
      console.log('HF API Exception:', error.message);
    }
    return null;
  }
}

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
 * Extract portfolio details using Hugging Face AI
 */
const extractPortfolioDataWithAI = async (resumeText) => {
  // Production-grade prompt optimized for clean JSON output
  const PROMPT_TEMPLATE = `You are an expert resume parser.

Extract information from the resume and return ONLY valid JSON.
Do not add explanations.
Do not use markdown.
Do not include any extra text.
Never wrap JSON in code blocks.
Return the JSON on a single line.

If a field is missing, use empty string "" or empty array [].

Resume:
{{RESUME_TEXT}}

Return JSON exactly in this structure:

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "title": "",
  "about": "",
  "github": "",
  "linkedin": "",
  "experience": [
    {
      "position": "",
      "company": "",
      "duration": "",
      "description"
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "link": ""
    }
  ],
  "certifications": [],
  "achievements": [],
  "languages": []
}`;

  // Inject resume text into prompt (limit to 2000 chars for token efficiency)
  const prompt = PROMPT_TEMPLATE.replace('{{RESUME_TEXT}}', resumeText.substring(0, 2000));

  console.log('🤖 Calling Hugging Face API...');
  const generatedText = await queryHuggingFace(prompt);

  if (!generatedText) {
    console.log('❌ HF API failed, using regex fallback');
    return null;
  }

  console.log('✅ HF API returned:', generatedText.substring(0, 200) + '...');

  // Extract JSON from the response
  try {
    // Try to find JSON object in response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Validate the data has some expected fields
      if (parsedData.name || parsedData.email || parsedData.experience) {
        console.log('✅ Successfully parsed AI extracted data');
        return parsedData;
      }
    }
  } catch (error) {
    console.log('❌ Failed to parse JSON from AI response:', error.message);
  }

  return null;
};

/**
 * Extract portfolio details from resume text (fallback regex method)
```
 */
const extractPortfolioData = (text) => {
  const data = {
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    about: '',
    github: '',
    linkedin: '',
    portfolio: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: []
  };

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const textLower = text.toLowerCase();

  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w{2,}/);
  if (emailMatch) data.email = emailMatch[0].toLowerCase();

  // Extract phone - Indian and international formats
  const phonePatterns = [
    /(?:\+91[-.\s]?)?[6-9]\d{9}/,
    /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\d{5}[-.\s]?\d{5}/
  ];
  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern);
    if (phoneMatch) {
      data.phone = phoneMatch[0];
      break;
    }
  }

  // Extract GitHub URL
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);
  if (githubMatch) data.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;

  // Extract LinkedIn URL
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) data.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;

  // Extract name (first few lines, 2-5 words, no special chars)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const wordCount = line.split(' ').filter(w => w.length > 0).length;
    if (line.length >= 3 && line.length <= 50 && 
        wordCount >= 2 && wordCount <= 5 &&
        /^[A-Z][a-zA-Z\s\.]+$/.test(line) && 
        !line.includes('@') && !line.includes('http')) {
      data.name = line;
      break;
    }
  }

  // Extract title/position
  const titlePatterns = [
    /(?:Senior|Junior|Lead|Principal|Staff|Sr\.?|Jr\.?)\s+(?:Software|Full[\s-]?Stack|Front[\s-]?End|Back[\s-]?End|Web|Mobile|DevOps|Data|AI|ML|Cloud)\s+(?:Developer|Engineer|Architect)/i,
    /(?:Full[\s-]?Stack|Front[\s-]?End|Back[\s-]?End|Software|Web|Mobile|DevOps|Data|AI|ML|Cloud)\s+(?:Developer|Engineer|Architect|Scientist)/i,
    /(?:Product|Project|Program|Engineering|Technical)\s+(?:Manager|Lead|Head|Director)/i,
    /(?:UI\/UX|UX\/UI)\s+(?:Designer|Developer)/i
  ];
  
  for (const pattern of titlePatterns) {
    const titleMatch = text.match(pattern);
    if (titleMatch) {
      data.title = titleMatch[0].replace(/\s+/g, ' ').trim();
      break;
    }
  }

  // Extract location
  const locationPatterns = [
    /(?:Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Chennai|Pune|Kolkata|Ahmedabad|Jaipur|Surat|Lucknow|Nagpur|Gurgaon|Gurugram|Noida)[,\s]+(?:India|Maharashtra|Karnataka|Tamil Nadu|Telangana|Gujarat|Delhi|Haryana|UP)/i,
    /(?:San Francisco|New York|Los Angeles|Seattle|Austin|Boston)[,\s]+(?:USA|US|California|CA|NY|Texas|TX|Washington|WA|MA)/i,
    /(?:London|Manchester|Birmingham|Edinburgh)[,\s]+(?:UK|United Kingdom|England|Scotland)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.location = match[0];
      break;
    }
  }

  // Extract about/summary
  const aboutMatch = text.match(/(?:SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|PROFILE|ABOUT)[\s:]*\n([\s\S]{50,500}?)(?=\n(?:EXPERIENCE|EDUCATION|SKILLS|PROJECTS|[A-Z]{4,})|$)/i);
  if (aboutMatch) {
    data.about = aboutMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extract skills
  const skillsMatch = text.match(/(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES)[\s:]*\n([\s\S]{20,800}?)(?=\n(?:EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|[A-Z]{4,})|$)/i);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    const skillSet = new Set();
    
    // Method 1: Comma/pipe separated
    const parts = skillsText.split(/[,|•·●∙]/);
    parts.forEach(part => {
      const cleaned = part.trim().replace(/^[-•·●∙\s]+/, '').replace(/[^\w\s\+\#\.\-]/g, '').trim();
      if (cleaned.length >= 2 && cleaned.length <= 30 && !/^(and|or|the)$/i.test(cleaned)) {
        skillSet.add(cleaned);
      }
    });
    
    // Method 2: Line by line
    skillsText.split('\n').forEach(line => {
      const cleaned = line.trim().replace(/^[-•·●∙\s]+/, '').replace(/[:;].*$/, '').trim();
      if (cleaned.length >= 2 && cleaned.length <= 30 && !cleaned.includes('  ')) {
        skillSet.add(cleaned);
      }
    });
    
    data.skills = Array.from(skillSet).slice(0, 30);
  }

  // Extract experience with multiple strategies - MUST EXTRACT IF EXISTS
  const expMatch = text.match(/(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE|CAREER HISTORY)[\s:]*\n([\s\S]{50,4000}?)(?=\n(?:EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|[A-Z]{5,})|$)/i);
  if (expMatch) {
    const expText = expMatch[1];
    const expLines = expText.split('\n').filter(l => l.trim().length > 0);
    const experiences = [];
    let currentExp = null;
    
    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i].trim();
      
      // Strategy 1: Position - Company format
      if (line.match(/[A-Za-z\s&,.-]{3,}(?:\s+[-–—|]\s+|\s+at\s+|\s+@\s+)[A-Za-z\s&,.-]{3,}/i)) {
        if (currentExp && currentExp.position) experiences.push(currentExp);
        
        const parts = line.split(/\s+[-–—|]\s+|\s+at\s+|\s+@\s+/i);
        currentExp = {
          position: parts[0]?.trim() || '',
          company: parts[1]?.trim() || '',
          duration: '',
          description: ''
        };
      }
      // Strategy 2: Company on one line, position on next
      else if (line.match(/^[A-Z][A-Za-z\s&,.-]{5,}(?:Ltd|Inc|Corp|LLC|Pvt|Technologies|Tech|Solutions|Systems|Services)?$/i) && !currentExp) {
        currentExp = {
          company: line,
          position: '',
          duration: '',
          description: ''
        };
      }
      // If we have company but no position, next line might be position
      else if (currentExp && currentExp.company && !currentExp.position && line.match(/^[A-Z][A-Za-z\s]+$/)) {
        currentExp.position = line;
      }
      // Check for date range - various formats
      else if (line.match(/(?:\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i) && line.match(/[-–—|to]/i)) {
        if (currentExp && !currentExp.duration) {
          currentExp.duration = line;
        }
      }
      // Description lines - anything substantial
      else if (currentExp && line.length > 20 && !line.match(/^[A-Z\s]{10,}$/) && currentExp.position) {
        currentExp.description += (currentExp.description ? ' ' : '') + line.replace(/^[-•·●∙]\s*/, '');
      }
    }
    
    // Push last experience
    if (currentExp && (currentExp.position || currentExp.company)) {
      experiences.push(currentExp);
    }
    
    // Filter out invalid entries
    data.experience = experiences.filter(exp => 
      (exp.position && exp.position.length > 2) || (exp.company && exp.company.length > 2)
    ).slice(0, 8);
  }

  // Extract education
  const eduMatch = text.match(/(?:EDUCATION|ACADEMIC|QUALIFICATION)[\s:]*\n([\s\S]{30,1500}?)(?=\n(?:EXPERIENCE|PROJECTS|SKILLS|CERTIFICATIONS|[A-Z]{5,})|$)/i);
  if (eduMatch) {
    const eduText = eduMatch[1];
    const eduLines = eduText.split('\n').filter(l => l.trim().length > 0);
    const educations = [];
    let currentEdu = null;
    
    for (const line of eduLines) {
      // Degree pattern
      if (line.match(/B\.?Tech|B\.?E\.?|M\.?Tech|M\.?E\.?|B\.?Sc|M\.?Sc|B\.?A\.?|M\.?A\.?|MBA|MCA|BCA|Bachelor|Master|Diploma|PhD/i)) {
        if (currentEdu) educations.push(currentEdu);
        currentEdu = { degree: line.trim(), institution: '', year: '' };
      }
      // Institution
      else if (line.match(/University|College|Institute|School/i) && currentEdu) {
        currentEdu.institution = line.trim();
      }
      // Year
      else if (line.match(/\d{4}/) && currentEdu && !currentEdu.year) {
        const yearMatch = line.match(/\d{4}/);
        currentEdu.year = yearMatch[0];
      }
    }
    if (currentEdu) educations.push(currentEdu);
    data.education = educations.slice(0, 5);
  }

  // Extract projects with multiple strategies - MUST EXTRACT IF EXISTS
  const projMatch = text.match(/(?:PROJECTS?|PERSONAL PROJECTS?|KEY PROJECTS?|ACADEMIC PROJECTS?|WORK PROJECTS?)[\s:]*\n([\s\S]{30,3500}?)(?=\n(?:EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|LANGUAGES|[A-Z]{5,})|$)/i);
  if (projMatch) {
    const projText = projMatch[1];
    const projLines = projText.split('\n').filter(l => l.trim().length > 0);
    const projects = [];
    let currentProj = null;
    
    for (let i = 0; i < projLines.length; i++) {
      const trimmed = projLines[i].trim();
      const nextLine = i + 1 < projLines.length ? projLines[i + 1].trim() : '';
      
      // Strategy 1: Project title with bullet/number
      const titleMatch = trimmed.match(/^(?:[\d\.\)]+\s*|[-•·●∙]\s*)([A-Za-z][A-Za-z0-9\s\-:()&]{4,80})$/);
      if (titleMatch) {
        if (currentProj && currentProj.name) projects.push(currentProj);
        
        currentProj = {
          name: titleMatch[1].trim(),
          description: '',
          technologies: [],
          link: ''
        };
        continue;
      }
      
      // Strategy 2: Capitalized title without bullets (check if not a section header)
      if (!currentProj && trimmed.length > 5 && trimmed.length < 100 && 
          trimmed.match(/^[A-Z]/) &&
          !trimmed.match(/^(?:Tech|Technologies|Description|Features|Link|URL|GitHub|Demo|Duration|Responsibilities):/i) &&
          !trimmed.match(/^[A-Z\s]{15,}$/) && // Not all caps (likely section header)
          trimmed.split(' ').length <= 12) {
        
        currentProj = {
          name: trimmed,
          description: '',
          technologies: [],
          link: ''
        };
        continue;
      }
      
      // Extract technologies
      if (currentProj && trimmed.match(/^(?:Tech(?:nologies)?|Stack|Tools|Built with)[\s:]+/i)) {
        const techText = trimmed.replace(/^(?:Tech(?:nologies)?|Stack|Tools|Built with)[\s:]+/i, '');
        currentProj.technologies = techText.split(/[,|;]/).map(t => t.trim().replace(/^[-•·●∙\s]+/, '')).filter(t => t.length > 0);
        continue;
      }
      
      // Extract GitHub/project links
      const linkMatch = trimmed.match(/(https?:\/\/[^\s]+)/);
      if (linkMatch && currentProj && !currentProj.link) {
        currentProj.link = linkMatch[0];
        continue;
      }
      
      // Extract description - any substantial text
      if (currentProj && trimmed.length > 15 && 
          !trimmed.match(/^(?:Tech|Technologies|Stack|Link|URL|GitHub|Demo):/i) &&
          !trimmed.match(/^[A-Z\s]{10,}$/) && // Not section header
          !trimmed.match(/^[\d\.\)]+\s*[A-Z]/) // Not next project bullet
      ) {
        // Clean bullet points from description
        const cleanDesc = trimmed.replace(/^[-•·●∙]\s*/, '');
        currentProj.description += (currentProj.description ? ' ' : '') + cleanDesc;
      }
    }
    
    // Push last project
    if (currentProj && currentProj.name) {
      projects.push(currentProj);
    }
    
    // Filter and validate
    data.projects = projects.filter(proj => 
      proj.name && proj.name.length > 3
    ).slice(0, 10);
  }

  // Extract certifications
  const certMatch = text.match(/(?:CERTIFICATIONS?|CERTIFICATES?)[\s:]*\n([\s\S]{20,1000}?)(?=\n(?:ACHIEVEMENTS?|PROJECTS|EXPERIENCE|EDUCATION|[A-Z]{5,})|$)/i);
  if (certMatch) {
    const certText = certMatch[1];
    const certLines = certText.split('\n').filter(l => l.trim().length > 5);
    data.certifications = certLines.map(line => 
      line.trim().replace(/^[-•·●∙\d\.\)\s]+/, '').trim()
    ).filter(cert => cert.length > 5 && cert.length < 150).slice(0, 10);
  }

  // Extract achievements
  const achieveMatch = text.match(/(?:ACHIEVEMENTS?|ACCOMPLISHMENTS?|AWARDS?)[\s:]*\n([\s\S]{20,1000}?)(?=\n(?:CERTIFICATIONS?|PROJECTS|EXPERIENCE|EDUCATION|[A-Z]{5,})|$)/i);
  if (achieveMatch) {
    const achieveText = achieveMatch[1];
    const achieveLines = achieveText.split('\n').filter(l => l.trim().length > 5);
    data.achievements = achieveLines.map(line => 
      line.trim().replace(/^[-•·●∙\d\.\)\s]+/, '').trim()
    ).filter(ach => ach.length > 5 && ach.length < 200).slice(0, 10);
  }

  // Extract languages
  const langMatch = text.match(/(?:LANGUAGES?)[\s:]*\n([\s\S]{10,300}?)(?=\n(?:[A-Z]{5,})|$)/i);
  if (langMatch) {
    const langText = langMatch[1];
    const langs = langText.split(/[,|\n]/).map(l => l.trim().replace(/^[-•·●∙\s]+/, '').trim());
    data.languages = langs.filter(lang => lang.length > 2 && lang.length < 30).slice(0, 10);
  }

  return data;
};

/**
 * Parse resume and extract portfolio details
 */
exports.parseResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (PDF or DOCX)'
      });
    }

    // Extract text from uploaded file
    const resumeText = await extractTextFromFile(req.file);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from the uploaded file'
      });
    }

    console.log('📄 Extracted text length:', resumeText.length);

    // Try AI extraction first
    let portfolioData = await extractPortfolioDataWithAI(resumeText);

    // If AI extraction fails or returns null, use regex fallback
    if (!portfolioData) {
      console.log('📊 Using regex extraction method');
      portfolioData = extractPortfolioData(resumeText);
    } else {
      console.log('🎉 AI extraction successful!');
    }

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: portfolioData
    });
  } catch (error) {
    console.error('Resume parsing error:', error);
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
      achievements: portfolioData.achievements || [],
      languages: portfolioData.languages || []
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
      if (portfolioData.languages !== undefined) portfolio.languages = portfolioData.languages;
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
            ${data.email ? `<a href="mailto:${data.email}">📧 ${data.email}</a>` : ''}
            ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
            ${data.location ? `<span>📍 ${data.location}</span>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank">💻 GitHub</a>` : ''}
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
                    ${proj.link ? `<a href="${proj.link}" target="_blank">View Project →</a>` : ''}
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
        <p>© ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
        <p>Built with Placify Portfolio Generator</p>
    </footer>
</body>
</html>`;
}
