const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.warn('No MONGO_URI provided — running without database');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    logger.error('MongoDB connection failure', { 
      message: err.message, 
      code: err.code,
      uri: process.env.MONGO_URI ? 'Present (Hidden)' : 'MISSING'
    });
    // Do NOT process.exit(1) on Vercel as it causes a 500 crash
    return null;
  }
};

module.exports = connectDB;
