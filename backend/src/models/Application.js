const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  company: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  resumeVersion: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Applied", "Interview", "Rejected", "Selected"],
    default: "Applied"
  },

  appliedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Application", applicationSchema);
