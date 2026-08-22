const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { connectDB, requireDatabase } = require('./config/database');

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "REST API for the MUWAFAK portfolio backend, including authentication, portfolio content, contact messages, and file uploads.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js').replace(/\\/g, '/')],
};

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
// Middleware
const allowedOrigins = [
  'https://muwafak-portfolio.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  // Support additional origins via comma-separated env var (e.g. preview deployments)
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
}));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Note: Removed static file serving - now using Cloudinary for all uploads

// All API routes depend on MongoDB. Fail quickly instead of buffering queries.
app.use('/api', requireDatabase);

// Routes
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio Backend API is running!' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required');
    process.exit(1);
  }

  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    });
}

module.exports = app;

