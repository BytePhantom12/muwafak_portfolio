const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME || 'portfolio';
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!mongoUri) throw new Error('MONGODB_URI is not configured');

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      dbName: databaseName,
      serverSelectionTimeoutMS: 5000,
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
  return mongoose.connection;
};

const requireDatabase = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database unavailable:', error.message);
    res.status(503).json({ message: 'Database service unavailable' });
  }
};

module.exports = { connectDB, requireDatabase };
