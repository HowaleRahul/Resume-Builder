const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const logger = require('./src/utils/logger');
const requestLogger = require('./src/middleware/requestLogger');
const resumeRoutes = require('./src/routes/resumeRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('MongoDB connected successfully'))
    .catch(err => logger.error('MongoDB connection error', { error: err.message, stack: err.stack }));
} else {
  logger.warn('No MONGO_URI provided — running without database (MVP mode)');
}

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV || 'development' }));
