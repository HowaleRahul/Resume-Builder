const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.warn('No MONGO_URI provided — running without database');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

module.exports = connectDB;
