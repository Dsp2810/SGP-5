const express = require("express");
const router = express.Router();
const { searchJobs } = require("../controllers/job.controller");
const { protect } = require("../middleware/auth.middleware");

// Protected route - requires authentication
router.get("/search", protect, searchJobs);

module.exports = router;
