const resumeGeneratorService = require('../services/resumeGeneratorService');
const Resume = require('../models/Resume');
const ResumeValidator = require('../utils/resumeValidator');
const path = require('path');

/**
 * Generate Resume from User Data
 * POST /api/resume/generate
 * Body: { resumeData: {...}, format: 'docx' }
 * Always generates DOCX. Frontend handles PDF conversion if needed.
 */
exports.generateResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const userId = req.user.id;

    // Validate resume data structure
    const validation = ResumeValidator.validate(resumeData);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false,
        message: 'Resume data validation failed',
        errors: validation.errors 
      });
    }

    // Use sanitized data for generation
    const sanitizedData = validation.sanitizedData;

    // Generate DOCX file
    const result = await resumeGeneratorService.generateDOCX(sanitizedData, userId);

    // Get latest version number for this user
    const latestResume = await Resume.findOne({ userId }).sort({ version: -1 });
    const newVersion = latestResume ? latestResume.version + 1 : 1;

    // Save to database with complete resume data
    const resume = new Resume({
      userId,
      version: newVersion,
      resumeData: sanitizedData, // Store complete data for version history
      resumeUrl: result.url,
      filename: result.filename,
      format: 'docx'
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume generated successfully',
      data: {
        version: newVersion,
        downloadUrl: result.url,
        filename: result.filename,
        format: 'docx',
        createdAt: resume.createdAt
      }
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Resume generation failed', 
      error: error.message 
    });
  }
};

/**
 * Download Generated Resume
 * GET /api/resume/download/:filename
 */
exports.downloadResume = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security: Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid filename' 
      });
    }

    const filepath = path.join(__dirname, '../../generated', filename);

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(404).json({ 
            success: false,
            message: 'File not found' 
          });
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Download failed', 
      error: error.message 
    });
  }
};

/**
 * Get Resume Version History
 * GET /api/resume/history
 */
exports.getResumeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const resumes = await Resume.find({ userId })
      .sort({ version: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-resumeData'); // Don't send full data in list

    const total = await Resume.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        resumes,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch resume history', 
      error: error.message 
    });
  }
};

/**
 * Get Specific Resume Version Data
 * GET /api/resume/version/:version
 */
exports.getResumeVersion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { version } = req.params;

    const resume = await Resume.findOne({ userId, version: parseInt(version) });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume version not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get version error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch resume version', 
      error: error.message 
    });
  }
};

/**
 * Delete Resume Version
 * DELETE /api/resume/:id
 */
exports.deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found or unauthorized' 
      });
    }

    // Delete physical file
    await resumeGeneratorService.deleteFile(resume.filename);

    // Delete database record
    await Resume.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete resume', 
      error: error.message 
    });
  }
};
