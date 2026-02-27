const { spawn } = require('child_process');
const util = require('util');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

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
    throw new Error('Unsupported file type. Please upload PDF or DOCX files.');
  }
};

/**
 * Analyze resume using Python ATS scorer with Sentence Transformers
 */
exports.analyzeResume = async (req, res) => {
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

    // Get job description from request body (required)
    const jobDescription = req.body.jobDescription || '';
    
    if (!jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      });
    }

    // Path to Python script
    const pythonScript = path.join(__dirname, '../services/atsScorer.py');
    
    console.log('Executing ATS analysis with Sentence Transformers...');
    
    // Use spawn instead of exec for better handling
    const { spawn } = require('child_process');
    
    // Use full Python path to ensure correct environment
    const pythonPath = process.env.PYTHON_PATH || 'python3';
    
    const python = spawn(pythonPath, [pythonScript, resumeText, jobDescription], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    let stdout = '';
    let stderr = '';
    
    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Wait for Python process to complete
    await new Promise((resolve, reject) => {
      python.on('close', (code) => {
        if (code !== 0) {
          console.error('Python stderr:', stderr);
          reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        } else {
          resolve();
        }
      });
      
      python.on('error', (error) => {
        console.error('Failed to start Python:', error);
        reject(new Error('Failed to execute ATS analysis. Make sure Python and sentence-transformers are installed.'));
      });
      
      // Set timeout
      setTimeout(() => {
        python.kill();
        reject(new Error('ATS analysis timeout'));
      }, 60000);
    }).catch((error) => {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to execute ATS analysis',
        error: stderr || error.toString()
      });
    });

    // Parse Python output
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Failed to parse Python output:', stdout);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse ATS analysis results',
        error: parseError.message
      });
    }

    // Check if analysis was successful
    if (!result.success) {
      console.error('ATS analysis returned error:', result.error);
      return res.status(500).json({
        success: false,
        message: result.error || 'ATS analysis failed'
      });
    }

    console.log('ATS analysis completed successfully. Score:', result.score);

    // Return results
    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: result
    });

  } catch (error) {
    console.error('ATS Analysis Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};
