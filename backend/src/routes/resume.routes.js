const express = require("express");
const router = express.Router();
const {
  uploadResume,
  getResumeHistory
} = require("../controllers/resume.controller");

const { protect } = require("../middleware/auth.middleware");

// Protected Routes
router.post("/upload", protect, uploadResume);
router.get("/history", protect, getResumeHistory);

module.exports = router;
