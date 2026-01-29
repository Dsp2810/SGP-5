const express = require("express");
const router = express.Router();
const {
  uploadResume,
  getResumeHistory
} = require("../controllers/resume.controller");

const { 
  generateResume, 
  downloadResume,
  getResumeVersion,
  deleteResume
} = require('../controllers/resumeGeneratorController');

const { protect } = require("../middleware/auth.middleware");

// Protected Routes
router.post("/upload", protect, uploadResume);
router.get("/history", protect, getResumeHistory);

// Resume Generator Routes
router.post("/generate", protect, generateResume);
router.get("/download/:filename", downloadResume);
router.get("/version/:version", protect, getResumeVersion);
router.delete("/:id", protect, deleteResume);

module.exports = router;
