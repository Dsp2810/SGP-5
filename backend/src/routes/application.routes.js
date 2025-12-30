const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications
} = require("../controllers/application.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Protected Routes
router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications);

module.exports = router;
