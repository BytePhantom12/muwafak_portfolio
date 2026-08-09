const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Validate session ID and expiration against MongoDB
    if (!decoded.sessionId) {
      return res.status(401).json({ message: 'Token is missing session identification', code: 'SESSION_INVALID' });
    }

    if (!user.activeSessionId || user.activeSessionId !== decoded.sessionId) {
      return res.status(401).json({ 
        message: 'Your session has ended because your account was signed in from another location.',
        code: 'SESSION_REPLACED'
      });
    }

    if (user.activeSessionExpiresAt && new Date(user.activeSessionExpiresAt) < new Date()) {
      return res.status(401).json({ 
        message: 'Session expired',
        code: 'SESSION_EXPIRED'
      });
    }
    
    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;