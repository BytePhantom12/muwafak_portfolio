const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { createRateLimit } = require('../middleware/rateLimit');

// Session duration: configurable via env, default 24 hours
const ADMIN_SESSION_DURATION = parseInt(process.env.ADMIN_SESSION_DURATION, 10) || 86400000;
const JWT_EXPIRES_IN_SECONDS = Math.max(60, Math.floor(ADMIN_SESSION_DURATION / 1000));
const getJwtSecret = () => process.env.JWT_SECRET;
const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts. Please try again later.'
});
const normalizeIdentity = (value) => typeof value === 'string' ? value.trim() : '';
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new account and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: muwafak
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Secret123!
 *     responses:
 *       "201":
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 66a2c9d5b5c4f4e5c9a1e111
 *                     username:
 *                       type: string
 *                       example: muwafak
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *       "400":
 *         description: User with this email or username already exists
 *       "500":
 *         description: Server error
 */
// POST /api/auth/register - Register new user
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const username = normalizeIdentity(req.body?.username);
    const email = normalizeIdentity(req.body?.email).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!username || !email || password.length < 8 || username.length > 50 || email.length > 254) {
      return res.status(400).json({ message: 'Username, email, and a password of at least 8 characters are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'A valid email address is required' });
    }

    // Bootstrap the first account only. Further registration requires an
    // out-of-band secret so this public route cannot mint arbitrary admins.
    const userCount = await User.countDocuments();
    if (userCount > 0 && (!process.env.REGISTRATION_SECRET || req.get('x-registration-secret') !== process.env.REGISTRATION_SECRET)) {
      return res.status(403).json({ message: 'Registration is disabled' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }
    
    // Create new user
    const user = new User({ username, email, password });
    
    // Generate session
    const sessionId = crypto.randomUUID();
    user.activeSessionId = sessionId;
    user.activeSessionExpiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION);
    await user.save();
    
    // Generate JWT token with sessionId
    const token = jwt.sign(
      { userId: user._id, sessionId }, 
      getJwtSecret(), 
      { expiresIn: JWT_EXPIRES_IN_SECONDS }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Accepts either a username or an email value in the username field and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Secret123!
 *     responses:
 *       "200":
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       "400":
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       "500":
 *         description: Server error
 */
// POST /api/auth/login - Login user
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const username = normalizeIdentity(req.body?.username);
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username/email and password' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is disabled' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate new session — this invalidates any previous session
    const sessionId = crypto.randomUUID();
    user.activeSessionId = sessionId;
    user.activeSessionExpiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION);
    await user.save();
    
    // Generate JWT token with sessionId
    const token = jwt.sign(
      { userId: user._id, sessionId }, 
      getJwtSecret(), 
      { expiresIn: JWT_EXPIRES_IN_SECONDS }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Current user returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: No token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is not valid
 *       "500":
 *         description: Server error
 */
// GET /api/auth/me - Get current user (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user and invalidate active session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Logged out successfully
 *       "401":
 *         description: Unauthorized
 */
// POST /api/auth/logout - Logout current user and clear session
router.post('/logout', auth, async (req, res) => {
  try {
    if (req.user) {
      req.user.activeSessionId = null;
      req.user.activeSessionExpiresAt = null;
      await req.user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
