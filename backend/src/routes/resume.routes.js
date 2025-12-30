const express = require("express");
const router = express.Router();
const {
  uploadResume,
  getResumeHistory
} = require("../controllers/resume.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Protected Routes
router.post("/upload", authMiddleware, uploadResume);
router.get("/history", authMiddleware, getResumeHistory);

module.exports = router;
