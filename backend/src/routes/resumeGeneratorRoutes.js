const express = require('express');
const router = express.Router();
const { 
  generateResume, 
  downloadResume,
  getResumeHistory,
  getResumeVersion,
  deleteResume
} = require('../controllers/resumeGeneratorController');
const authMiddleware = require('../middleware/auth.middleware');

// Generate resume from user data (PDF or DOCX)
router.post('/generate', authMiddleware, generateResume);

// Download generated resume file
router.get('/download/:filename', downloadResume);

// Get resume version history for logged-in user
router.get('/history', authMiddleware, getResumeHistory);

// Get specific resume version data
router.get('/version/:version', authMiddleware, getResumeVersion);

// Delete resume by ID
router.delete('/:id', authMiddleware, deleteResume);

module.exports = router;
