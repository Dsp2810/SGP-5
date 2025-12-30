const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  version: {
    type: Number,
    required: true
  },

  resumeUrl: {
    type: String,
    required: true
  },

  atsScore: {
    type: Number,
    default: null
  },

  aiSuggestions: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", resumeSchema);
