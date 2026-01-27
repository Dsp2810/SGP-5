const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/me", protect, getMe);

module.exports = router;
