const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const fs = require('fs').promises;
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
 * Analyze resume using Python ATS scorer
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

    // Get job description from request body (optional)
    const jobDescription = req.body.jobDescription || '';

    // Path to Python script
    const pythonScript = path.join(__dirname, '../services/atsScorer.py');
    
    // Use virtual environment Python if available, fallback to system Python
    // Virtual environment is at project root, not backend folder
    const venvPython = path.join(__dirname, '../../../.venv/Scripts/python.exe');
    let pythonCommand = 'python';
    
    try {
      await fs.access(venvPython);
      pythonCommand = venvPython;
      console.log('Using virtual environment Python:', venvPython);
    } catch (error) {
      console.log('Virtual environment not found, using system Python');
    }

    // Check if Python script exists
    try {
      await fs.access(pythonScript);
      console.log('Python script found:', pythonScript);
    } catch (error) {
      console.error('Python script not found:', pythonScript);
      return res.status(500).json({
        success: false,
        message: 'ATS scorer service not found'
      });
    }

    // Escape arguments for shell
    const escapeArg = (arg) => {
      return arg.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
    };

    // Execute Python script
    const command = `"${pythonCommand}" "${pythonScript}" "${escapeArg(resumeText)}" "${escapeArg(jobDescription)}"`;
    
    console.log('Executing ATS analysis...');
    console.log('Python command:', pythonCommand);
    console.log('Resume text length:', resumeText.length, 'characters');
    console.log('Job description length:', jobDescription.length, 'characters');
    
    let stdout, stderr;
    try {
      const result = await execPromise(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 30000 // 30 second timeout
      });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (execError) {
      console.error('Python execution error:', execError);
      console.error('Command:', command);
      return res.status(500).json({
        success: false,
        message: 'Failed to execute ATS analysis',
        error: execError.message,
        details: execError.stderr || execError.stdout
      });
    }

    if (stderr && !stderr.includes('UserWarning')) {
      console.error('Python stderr:', stderr);
    }

    console.log('Python stdout:', stdout.substring(0, 500)); // Log first 500 chars

    // Parse Python output
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Failed to parse Python output:', stdout);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse ATS analysis results',
        error: parseError.message,
        output: stdout.substring(0, 500)
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

    console.log('ATS analysis completed successfully. Score:', result.overallScore);

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

/**
 * Health check for ATS service
 */
exports.checkATSService = async (req, res) => {
  try {
    const pythonScript = path.join(__dirname, '../services/atsScorer.py');
    
    // Check if Python script exists
    await fs.access(pythonScript);

    // Try to execute Python with version check
    const { stdout } = await execPromise('python --version');
    
    return res.status(200).json({
      success: true,
      message: 'ATS service is available',
      pythonVersion: stdout.trim(),
      scriptPath: pythonScript
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'ATS service is not available',
      error: error.message,
      instructions: [
        'Install Python: https://www.python.org/downloads/',
        'Install dependencies: pip install -r requirements.txt',
        'Download spaCy model: python -m spacy download en_core_web_sm'
      ]
    });
  }
};
