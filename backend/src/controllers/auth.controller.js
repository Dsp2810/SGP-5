const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailService");

exports.register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Validate username
    const normalizedUsername = (username || '').toLowerCase().trim();
    if (!normalizedUsername || !/^[a-z0-9_-]{3,30}$/.test(normalizedUsername)) {
      return res.status(400).json({ message: "Username must be 3-30 characters (lowercase letters, numbers, hyphens, underscores only)" });
    }

    // Check if username is taken
    const usernameExists = await User.findOne({ username: normalizedUsername });
    if (usernameExists)
      return res.status(400).json({ message: "Username is already taken" });

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email: normalizedEmail, password, username: normalizedUsername });

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ token, username: user.username, message:"Login Successfully !"});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Request OTP for password reset
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate OTP
    const otp = emailService.generateOTP();
    
    // Hash OTP before storing
    const hashedOTP = await bcrypt.hash(otp, 10);
    
    // Set OTP and expiry (10 minutes)
    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();

    // Send OTP email
    await emailService.sendOTPEmail(normalizedEmail, otp, user.name);

    res.json({ 
      success: true,
      message: "OTP sent to your email. Valid for 10 minutes." 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with OTP fields
    const user = await User.findOne({ email: normalizedEmail })
      .select('+resetPasswordOTP +resetPasswordOTPExpire');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP exists
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpire) {
      return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
    }

    // Check if OTP expired
    if (Date.now() > user.resetPasswordOTPExpire) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ 
      success: true,
      message: "OTP verified successfully. You can now reset your password." 
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/**
 * Reset password after OTP verification
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: "Email, OTP, and new password are required" 
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with OTP fields
    const user = await User.findOne({ email: normalizedEmail })
      .select('+resetPasswordOTP +resetPasswordOTPExpire +password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP exists
    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpire) {
      return res.status(400).json({ 
        message: "No OTP request found. Please request a new OTP." 
      });
    }

    // Check if OTP expired
    if (Date.now() > user.resetPasswordOTPExpire) {
      return res.status(400).json({ 
        message: "OTP has expired. Please request a new one." 
      });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    
    await user.save();

    // Send success email
    await emailService.sendPasswordResetSuccessEmail(normalizedEmail, user.name);

    res.json({ 
      success: true,
      message: "Password reset successful. You can now login with your new password." 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

/**
 * Check username availability
 * GET /api/auth/check-username/:username
 */
exports.checkUsername = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    if (!/^[a-z0-9_-]{3,30}$/.test(username)) {
      return res.json({ available: false, message: "Invalid username format" });
    }
    const exists = await User.findOne({ username });
    res.json({ available: !exists });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
