const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/resume", require("./resume.routes"));
router.use("/application", require("./application.routes"));
router.use("/jobs", require("./job.routes"));
router.use("/ats", require("./ats.routes"));
router.use("/portfolio", require("./portfolio.routes"));

module.exports = router;
