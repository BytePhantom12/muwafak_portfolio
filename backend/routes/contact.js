const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

// POST /api/contact - Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
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
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message. Please try again.' 
    });
  }
});

// GET /api/contact - Get all contact messages (protected)
router.get('/', auth, async (req, res) => {
  try {
    const { read, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await ContactMessage.countDocuments(query);
    const unreadCount = await ContactMessage.countDocuments({ read: false });
    
    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
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

// PATCH /api/contact/:id/read - Mark message as read/unread (protected)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const { read } = req.body;
    
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

// PATCH /api/contact/:id/reply - Add reply to message (protected)
router.patch('/:id/reply', auth, async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    if (!replyMessage) {
      return res.status(400).json({ 
        success: false,
        message: 'Reply message is required' 
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

// DELETE /api/contact - Delete multiple messages (protected)
router.delete('/', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Message IDs array is required' 
      });
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
