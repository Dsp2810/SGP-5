const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
  checkUsername
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.get("/check-username/:username", checkUsername);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Protected Route
router.get("/me", protect, getMe);

module.exports = router;
