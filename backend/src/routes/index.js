const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/resume", require("./resume.routes"));
router.use("/application", require("./application.routes"));

module.exports = router;
