const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth.middleware');
const portfolioController = require('../controllers/portfolio.controller');

// Configure multer for file upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Parse resume and extract portfolio details
router.post('/parse-resume', protect, upload.single('resume'), portfolioController.parseResume);

// Deploy portfolio and return link
router.post('/deploy', protect, portfolioController.deployPortfolio);

// Get user's portfolios
router.get('/my-portfolios', protect, portfolioController.getUserPortfolios);

// Update portfolio
router.put('/:portfolioId', protect, portfolioController.updatePortfolio);

// Delete portfolio
router.delete('/:portfolioId', protect, portfolioController.deletePortfolio);

// Public route - Get portfolio by ID (no auth required)
router.get('/:portfolioId', portfolioController.getPortfolio);

module.exports = router;
