const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  portfolioId: {
    type: String,
    required: true,
    unique: true
  },
  template: {
    type: String,
    default: 'template1'
  },
  personalInfo: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: String,
    phone: String,
    location: String,
    about: String,
    github: String,
    linkedin: String,
    portfolio: String,
    profilePhoto: String // Cloudinary URL
  },
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    responsibilities: [String]
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
    cgpa: String
  }],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String,
    image: String // Cloudinary URL
  }],
  certifications: [String],
  achievements: [String],
  languages: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster lookups (portfolioId already has index from unique: true)
portfolioSchema.index({ userId: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
