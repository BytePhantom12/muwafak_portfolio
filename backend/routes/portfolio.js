const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');
const seedData = require('../../shared/seedData.json');
const { deleteFromCloudinary } = require('../config/cloudinary');

const EDITABLE_SECTIONS = new Set([
  'profile', 'about', 'skills', 'education', 'experience', 'projects',
  'contact', 'socials', 'typingPhrases', 'statistics'
]);

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

// GET /api/portfolio/cv/download - Download the current CV with a usable filename
router.get('/cv/download', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().select('profile.resume profile.name');
    const resumeUrl = portfolio?.profile?.resume;
    if (!resumeUrl || typeof resumeUrl !== 'string') {
      return res.status(404).json({ message: 'CV not found' });
    }

    const parsedUrl = new URL(resumeUrl);
    if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'res.cloudinary.com') {
      return res.status(400).json({ message: 'Invalid CV URL' });
    }

    const upstream = await fetch(parsedUrl);
    if (!upstream.ok) {
      return res.status(502).json({ message: 'CV download is unavailable' });
    }

    const fileBuffer = Buffer.from(await upstream.arrayBuffer());
    let extension = parsedUrl.pathname.match(/\.(pdf|doc|docx|odt|rtf|txt)$/i)?.[1]?.toLowerCase();
    if (!extension && fileBuffer.subarray(0, 4).toString() === '%PDF') extension = 'pdf';
    if (!extension && fileBuffer.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0]))) extension = 'doc';
    if (!extension && fileBuffer.subarray(0, 2).toString() === 'PK') extension = 'docx';
    if (!extension && fileBuffer.subarray(0, 5).toString() === '{\\rtf') extension = 'rtf';
    if (!extension) extension = 'txt';

    const contentTypes = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      odt: 'application/vnd.oasis.opendocument.text',
      rtf: 'application/rtf',
      txt: 'text/plain',
    };
    const safeName = (portfolio.profile?.name || 'portfolio').replace(/[^a-zA-Z0-9_-]+/g, '-');
    res.setHeader('Content-Type', contentTypes[extension]);
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}-CV.${extension}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    return res.send(fileBuffer);
  } catch (error) {
    console.error('CV download error:', error.message);
    return res.status(500).json({ message: 'CV download failed' });
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
    let portfolio = await Portfolio.findOne();
    const oldProfileImageId = portfolio?.profile?.profileImage?.public_id;
    
    if (!portfolio) {
      portfolio = new Portfolio(req.body);
    } else {
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

    const newProfileImageId = portfolio.profile?.profileImage?.public_id;
    const oldProfileImageIsShared = oldProfileImageId && portfolio.projects.some(
      project => project.image?.public_id === oldProfileImageId
    );
    if (oldProfileImageId && oldProfileImageId !== newProfileImageId && !oldProfileImageIsShared) {
      try {
        await deleteFromCloudinary(oldProfileImageId, 'image');
      } catch (cloudinaryErr) {
        console.error(`Old profile image cleanup failed (${oldProfileImageId}):`, cloudinaryErr.message);
      }
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ 
      message: error.name === 'ValidationError' ? 'Invalid portfolio data' : 'Server error'
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
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Validate section exists in schema
    if (!EDITABLE_SECTIONS.has(section)) {
      return res.status(400).json({ message: `Invalid section: ${section}` });
    }
    
    portfolio[section] = updateData;
    await portfolio.save();
    
    res.json(portfolio);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ 
      message: error.name === 'ValidationError' ? 'Invalid section data' : 'Server error'
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

    const oldImageIsShared = oldPublicId && portfolio.projects.some(
      p => p._id.toString() !== id && p.image?.public_id === oldPublicId
    );

    // Update project fields
    project.set(updatedData);
    await portfolio.save();

    // Delete only after MongoDB safely references the replacement.
    if (oldPublicId && oldPublicId !== newPublicId && !oldImageIsShared) {
      try {
        await deleteFromCloudinary(oldPublicId, 'image');
      } catch (cloudinaryErr) {
        console.error(`Old project image cleanup failed (${oldPublicId}):`, cloudinaryErr.message);
      }
    }
    
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

    const publicId = project.image?.public_id;
    const imageIsShared = publicId && portfolio.projects.some(
      p => p._id.toString() !== id && p.image?.public_id === publicId
    );

    // Remove subdocument
    project.deleteOne();
    await portfolio.save();

    if (publicId && !imageIsShared) {
      try {
        await deleteFromCloudinary(publicId, 'image');
      } catch (cloudinaryErr) {
        console.error(`Deleted project image cleanup failed (${publicId}):`, cloudinaryErr.message);
      }
    }
    
    res.json({ message: 'Project deleted successfully', projects: portfolio.projects });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
