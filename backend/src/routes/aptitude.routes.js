const express = require('express');
const router = express.Router();
const { generateMCQs } = require('../controllers/aptitude.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/aptitude/generate
router.post('/generate', protect, generateMCQs);

module.exports = router;
