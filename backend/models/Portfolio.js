const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  profile: {
    name: { type: String, required: false },
    title: { type: String, required: false },
    bio: { type: String, required: false },
    email: { type: String, required: false },
    phone: String,
    location: String,
    profileImage: String,
    resume: String
  },
  
  about: {
    description: { type: String, required: false },
    highlights: [String]
  },
  
  skills: [{
    category: { type: String, required: false },
    items: [String]
  }],
  
  education: [{
    institution: { type: String, required: false },
    degree: { type: String, required: false },
    field: String,
    startDate: Date,
    endDate: Date,
    description: String,
    gpa: String
  }],
  
  experience: [{
    company: { type: String, required: false },
    position: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
    technologies: [String]
  }],
  
  projects: [{
    title: { type: String, required: false },
    description: { type: String, required: false },
    image: String,
    technologies: [String],
    liveUrl: String,
    githubUrl: String,
    featured: { type: Boolean, default: false }
  }],
  
  contact: {
    email: { type: String, required: false },
    phone: String,
    social: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);