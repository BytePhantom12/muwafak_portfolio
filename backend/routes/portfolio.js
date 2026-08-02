const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');

// GET /api/portfolio - Get portfolio data
router.get('/', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      // Create default portfolio if none exists
      portfolio = new Portfolio({
        profile: {
          name: 'Your Name',
          title: 'Full Stack Developer',
          bio: 'Passionate developer creating amazing web experiences',
          email: 'your.email@example.com'
        },
        about: {
          description: 'Add your about description here'
        },
        skills: [],
        techStack: [],
        education: [],
        experience: [],
        projects: [],
        contact: {
          email: 'your.email@example.com'
        }
      });
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/portfolio - Update portfolio data (protected)
router.put('/', auth, async (req, res) => {
  try {
    console.log('Updating entire portfolio');
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      console.log('Creating new portfolio');
      portfolio = new Portfolio(req.body);
    } else {
      console.log('Updating existing portfolio');
      // Deep merge to preserve existing data
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key]) && req.body[key] !== null) {
          portfolio[key] = { ...portfolio[key], ...req.body[key] };
        } else {
          portfolio[key] = req.body[key];
        }
      });
    }
    
    await portfolio.save();
    console.log('Portfolio updated successfully');
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// PUT /api/portfolio/section/:section - Update specific section
router.put('/section/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    const updateData = req.body;
    
    console.log(`Updating section: ${section}`);
    console.log('Update data:', JSON.stringify(updateData, null, 2));
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      console.log('Portfolio not found, creating new one');
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Validate section exists in schema
    if (!(section in portfolio.toObject())) {
      console.log(`Invalid section: ${section}`);
      return res.status(400).json({ message: `Invalid section: ${section}` });
    }
    
    portfolio[section] = updateData;
    await portfolio.save();
    
    console.log(`Section ${section} updated successfully`);
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating section:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
});

module.exports = router;