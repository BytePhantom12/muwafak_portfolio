const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');
const seedData = require('../../shared/seedData.json');

/**
 * @openapi
 * /api/portfolio:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Get portfolio data
 *     responses:
 *       "200":
 *         description: Portfolio returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                 about:
 *                   type: object
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: object
 *                 education:
 *                   type: array
 *                   items:
 *                     type: object
 *                 experience:
 *                   type: array
 *                   items:
 *                     type: object
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                 contact:
 *                   type: object
 *       "500":
 *         description: Server error
 */
// GET /api/portfolio - Get portfolio data
router.get('/', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    
    if (!portfolio) {
      // Create default portfolio if none exists using shared seed helper
      portfolio = new Portfolio(seedData);
      await portfolio.save();
    }
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/portfolio:
 *   put:
 *     tags:
 *       - Portfolio
 *     summary: Update portfolio data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Partial or complete portfolio object matching the stored portfolio schema.
 *             properties:
 *               profile:
 *                 type: object
 *               about:
 *                 type: object
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *               contact:
 *                 type: object
 *     responses:
 *       "200":
 *         description: Portfolio updated successfully
 *       "401":
 *         description: No token or invalid token
 *       "500":
 *         description: Server error
 */
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

/**
 * @openapi
 * /api/portfolio/section/{section}:
 *   put:
 *     tags:
 *       - Portfolio
 *     summary: Update a specific portfolio section
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio section key such as profile, about, skills, education, experience, projects, or contact.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Section payload matching the selected section.
 *     responses:
 *       "200":
 *         description: Section updated successfully
 *       "400":
 *         description: Invalid section
 *       "404":
 *         description: Portfolio not found
 *       "401":
 *         description: No token or invalid token
 *       "500":
 *         description: Server error
 */
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

/**
 * @openapi
 * /api/portfolio/projects:
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Add a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       "201":
 *         description: Project created successfully
 */
// POST /api/portfolio/projects - Add new project
router.post('/projects', auth, async (req, res) => {
  try {
    const projectData = req.body;
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Add validation to prevent duplicate project IDs
    if (projectData._id && portfolio.projects.some(p => p._id.toString() === projectData._id.toString())) {
      return res.status(400).json({ message: 'Duplicate project ID detected' });
    }
    
    portfolio.projects.push(projectData);
    await portfolio.save();
    
    const newProject = portfolio.projects[portfolio.projects.length - 1];
    res.status(201).json({ message: 'Project created successfully', project: newProject, projects: portfolio.projects });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @openapi
 * /api/portfolio/projects/{id}:
 *   put:
 *     tags:
 *       - Portfolio
 *     summary: Update a specific project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       "200":
 *         description: Project updated successfully
 */
// PUT /api/portfolio/projects/:id - Update a specific project
router.put('/projects/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    const project = portfolio.projects.id(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If the image is replaced, delete the OLD Cloudinary image for that project only
    const oldPublicId = project.image?.public_id;
    const newPublicId = updatedData.image?.public_id;

    if (oldPublicId && oldPublicId !== newPublicId) {
      // Check if any OTHER project in the database currently uses the same public_id to avoid deleting shared images
      const otherProjectsWithSameImage = portfolio.projects.filter(p => p._id.toString() !== id && p.image?.public_id === oldPublicId);
      if (otherProjectsWithSameImage.length === 0) {
        try {
          const { deleteFromCloudinary } = require('../config/cloudinary');
          await deleteFromCloudinary(oldPublicId, 'image');
          console.log(`Successfully deleted old Cloudinary image: ${oldPublicId}`);
        } catch (cloudinaryErr) {
          console.error(`Failed to delete old Cloudinary image ${oldPublicId}:`, cloudinaryErr);
        }
      } else {
        console.log(`Skipped deleting old Cloudinary image ${oldPublicId} because it is referenced by other projects`);
      }
    }

    // Update project fields
    project.set(updatedData);
    await portfolio.save();
    
    res.json({ message: 'Project updated successfully', project, projects: portfolio.projects });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @openapi
 * /api/portfolio/projects/{id}:
 *   delete:
 *     tags:
 *       - Portfolio
 *     summary: Delete a specific project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Project deleted successfully
 */
// DELETE /api/portfolio/projects/:id - Delete a specific project
router.delete('/projects/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    const project = portfolio.projects.id(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Clean up its Cloudinary image if it exists and no other project references it
    const publicId = project.image?.public_id;
    if (publicId) {
      const otherProjectsWithSameImage = portfolio.projects.filter(p => p._id.toString() !== id && p.image?.public_id === publicId);
      if (otherProjectsWithSameImage.length === 0) {
        try {
          const { deleteFromCloudinary } = require('../config/cloudinary');
          await deleteFromCloudinary(publicId, 'image');
          console.log(`Successfully deleted Cloudinary image on project deletion: ${publicId}`);
        } catch (cloudinaryErr) {
          console.error(`Failed to delete Cloudinary image ${publicId}:`, cloudinaryErr);
        }
      }
    }

    // Remove subdocument
    project.deleteOne();
    await portfolio.save();
    
    res.json({ message: 'Project deleted successfully', projects: portfolio.projects });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;