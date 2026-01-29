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

  resumeData: {
    type: Object,
    default: null
  },

  resumeUrl: {
    type: String,
    required: true
  },

  filename: {
    type: String,
    required: true
  },

  format: {
    type: String,
    enum: ['pdf', 'docx'],
    default: 'docx'
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
