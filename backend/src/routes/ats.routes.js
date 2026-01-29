const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth.middleware');
const atsController = require('../controllers/ats.controller');

// Configure multer for file upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF and DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

// @route   POST /api/ats/analyze
// @desc    Analyze resume with ATS scoring
// @access  Private
router.post('/analyze', protect, upload.single('resume'), atsController.analyzeResume);

// @route   GET /api/ats/health
// @desc    Check ATS service status
// @access  Private
router.get('/health', protect, atsController.checkATSService);

module.exports = router;
