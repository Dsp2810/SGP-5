const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications
} = require("../controllers/application.controller");

const { protect } = require("../middleware/auth.middleware");

// Protected Routes
router.post("/", protect, createApplication);
router.get("/", protect, getApplications);

module.exports = router;
