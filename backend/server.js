const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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
  apis: ["./routes/**/*.js"],
   // or wherever your route annotations are
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: Removed static file serving - now using Cloudinary for all uploads

// Routes
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio Backend API is running!' });
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI;

let isConnecting = false;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (isConnecting) return;
  if (!mongoUri) {
    console.warn('MONGODB_URI / MONGO_URI not set. Set it in your environment to enable database access.');
    return;
  }
  try {
    isConnecting = true;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  } finally {
    isConnecting = false;
  }
};

connectDB();

// Ensure DB is connected for incoming API requests (especially on serverless/Vercel)
app.use(async (req, res, next) => {
  if (mongoUri && mongoose.connection.readyState === 0) {
    await connectDB();
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

