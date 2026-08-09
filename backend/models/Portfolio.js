const mongoose = require('mongoose');

const cloudinaryImageSchema = new mongoose.Schema({
  secure_url: { type: String, default: null },
  public_id: { type: String, default: null },
  width: { type: Number, default: null },
  height: { type: Number, default: null },
  format: { type: String, default: null }
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  profile: {
    name: { type: String, required: false },
    title: { type: String, required: false },
    bio: { type: String, required: false },
    email: { type: String, required: false },
    phone: String,
    location: String,
    languages: String,
    availability: String,
    profileImage: { type: cloudinaryImageSchema, default: () => ({}) },
    resume: String
  },
  
  about: {
    introHeading: String,
    introHeadingHighlight: String,
    introDescription: String,
    yearsOfExperience: Number,
    projectsDone: Number,
    location: String,
    role: String,
    education: String,
    languages: String,
    description: { type: String, required: false },
    highlights: [String]
  },
  
  skills: [{
    category: { type: String, required: false },
    items: [mongoose.Schema.Types.Mixed]
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
    image: { type: cloudinaryImageSchema, default: () => ({}) },
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
      website: String,
      facebook: String,
      whatsapp: String
    }
  },

  socials: [mongoose.Schema.Types.Mixed],

  typingPhrases: [String],

  statistics: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);