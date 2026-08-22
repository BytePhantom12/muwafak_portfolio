const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');
const { createRateLimit } = require('../middleware/rateLimit');

const contactRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many messages submitted. Please try again later.'
});
const cleanText = (value) => typeof value === 'string' ? value.trim() : '';

router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid message ID' });
  }
  return next();
});

/**
 * @openapi
 * /api/contact:
 *   post:
 *     tags:
 *       - Contact
 *     summary: Submit a contact message
 *     description: Public endpoint used by the portfolio contact form.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               subject:
 *                 type: string
 *                 example: Project inquiry
 *               message:
 *                 type: string
 *                 example: I would like to discuss a new portfolio website.
 *     responses:
 *       "201":
 *         description: Message sent successfully
 *       "400":
 *         description: Validation error
 *       "500":
 *         description: Failed to send message
 */
// POST /api/contact - Submit contact form (public)
router.post('/', contactRateLimit, async (req, res) => {
  try {
    const name = cleanText(req.body?.name);
    const email = cleanText(req.body?.email).toLowerCase();
    const subject = cleanText(req.body?.subject);
    const message = cleanText(req.body?.message);
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }
    
    // Create new contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
    
    await contactMessage.save();
    
    console.log('New contact message received:', {
      name,
      email,
      subject,
      id: contactMessage._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        createdAt: contactMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    const isValidationError = error.name === 'ValidationError';
    res.status(isValidationError ? 400 : 500).json({ 
      success: false,
      message: isValidationError ? 'Please check the submitted fields' : 'Failed to send message. Please try again.'
    });
  }
});

/**
 * @openapi
 * /api/contact:
 *   get:
 *     tags:
 *       - Contact
 *     summary: Get all contact messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filter by read status.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to return.
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of messages to skip.
 *     responses:
 *       "200":
 *         description: Messages returned successfully
 *       "401":
 *         description: No token or invalid token
 *       "500":
 *         description: Failed to fetch messages
 */
// GET /api/contact - Get all contact messages (protected)
router.get('/', auth, async (req, res) => {
  try {
    const { read, limit = 50, skip = 0 } = req.query;
    const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 100);
    const safeSkip = Math.max(Number.parseInt(skip, 10) || 0, 0);
    
    const query = {};
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .skip(safeSkip);
    
    const total = await ContactMessage.countDocuments(query);
    const unreadCount = await ContactMessage.countDocuments({ read: false });
    
    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        limit: safeLimit,
        skip: safeSkip,
        hasMore: total > safeSkip + safeLimit
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch messages' 
    });
  }
});

/**
 * @openapi
 * /api/contact/{id}:
 *   get:
 *     tags:
 *       - Contact
 *     summary: Get a single contact message
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
 *         description: Message returned successfully
 *       "401":
 *         description: No token or invalid token
 *       "404":
 *         description: Message not found
 *       "500":
 *         description: Failed to fetch message
 */
// GET /api/contact/:id - Get single message (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message not found' 
      });
    }
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch message' 
    });
  }
});

/**
 * @openapi
 * /api/contact/{id}/read:
 *   patch:
 *     tags:
 *       - Contact
 *     summary: Mark a contact message as read or unread
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               read:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       "200":
 *         description: Message updated successfully
 *       "401":
 *         description: No token or invalid token
 *       "404":
 *         description: Message not found
 *       "500":
 *         description: Failed to update message
 */
// PATCH /api/contact/:id/read - Mark message as read/unread (protected)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const { read } = req.body;
    if (read !== undefined && typeof read !== 'boolean') {
      return res.status(400).json({ success: false, message: 'read must be a boolean' });
    }
    
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: read !== undefined ? read : true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message not found' 
      });
    }
    
    res.json({
      success: true,
      message: `Message marked as ${message.read ? 'read' : 'unread'}`,
      data: message
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update message' 
    });
  }
});

/**
 * @openapi
 * /api/contact/{id}/reply:
 *   patch:
 *     tags:
 *       - Contact
 *     summary: Save a reply for a contact message
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
 *             required:
 *               - replyMessage
 *             properties:
 *               replyMessage:
 *                 type: string
 *                 example: Thanks for reaching out. I will get back to you soon.
 *     responses:
 *       "200":
 *         description: Reply saved successfully
 *       "400":
 *         description: Reply message is required
 *       "401":
 *         description: No token or invalid token
 *       "404":
 *         description: Message not found
 *       "500":
 *         description: Failed to save reply
 */
// PATCH /api/contact/:id/reply - Add reply to message (protected)
router.patch('/:id/reply', auth, async (req, res) => {
  try {
    const replyMessage = cleanText(req.body?.replyMessage);
    
    if (!replyMessage || replyMessage.length > 5000) {
      return res.status(400).json({ 
        success: false,
        message: 'Reply message is required and must be 5000 characters or fewer'
      });
    }
    
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { 
        replyMessage,
        replied: true,
        read: true
      },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Reply saved successfully',
      data: message
    });
  } catch (error) {
    console.error('Error saving reply:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save reply' 
    });
  }
});

/**
 * @openapi
 * /api/contact/{id}:
 *   delete:
 *     tags:
 *       - Contact
 *     summary: Delete a contact message
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
 *         description: Message deleted successfully
 *       "401":
 *         description: No token or invalid token
 *       "404":
 *         description: Message not found
 *       "500":
 *         description: Failed to delete message
 */
// DELETE /api/contact/:id - Delete message (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete message' 
    });
  }
});

/**
 * @openapi
 * /api/contact:
 *   delete:
 *     tags:
 *       - Contact
 *     summary: Delete multiple contact messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 66a2c9d5b5c4f4e5c9a1e111
 *                   - 66a2c9d5b5c4f4e5c9a1e112
 *     responses:
 *       "200":
 *         description: Messages deleted successfully
 *       "400":
 *         description: Message IDs array is required
 *       "401":
 *         description: No token or invalid token
 *       "500":
 *         description: Failed to delete messages
 */
// DELETE /api/contact - Delete multiple messages (protected)
router.delete('/', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0 || ids.length > 100) {
      return res.status(400).json({ 
        success: false,
        message: 'Between 1 and 100 message IDs are required'
      });
    }
    if (!ids.every((id) => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ success: false, message: 'Every message ID must be valid' });
    }
    
    const result = await ContactMessage.deleteMany({
      _id: { $in: ids }
    });
    
    res.json({
      success: true,
      message: `${result.deletedCount} message(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete messages' 
    });
  }
});

module.exports = router;
