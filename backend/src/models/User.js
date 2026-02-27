const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9_-]{3,30}$/, 'Username must be 3-30 characters and can only contain lowercase letters, numbers, hyphens, and underscores']
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },

  resetPasswordOTP: {
    type: String,
    select: false
  },

  resetPasswordOTPExpire: {
    type: Date,
    select: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
