require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const requestLogger = require('./src/middleware/requestLogger');

// Initial boot check
console.log('🚀 CareerFlow AI: Initialization sequence started...');

// Environment Critical Check
if (!process.env.GEMINI_API_KEY) {
  logger.error('CRITICAL: GEMINI_API_KEY is missing in .env. AI features will fail.');
  process.exit(1);
}

// Database Configuration
connectDB();

// Routes
const resumeRoutes = require('./src/routes/resumeRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development, fine-tune for production
}));
app.use(compression());

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000'
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(requestLogger);

// Rate Limiting
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 AI requests per window
  message: { success: false, message: "Too many AI requests from this IP, please try again after 15 minutes." }
});

app.use('/api/ai', aiLimiter); // Apply rate limiting to AI routes

// Route Registration
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Health check with DB status
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    db: dbStatus,
    message: 'CareerFlow AI Backend is active and optimized' 
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, { port: PORT, env: process.env.NODE_ENV || 'development' });
    console.log(`✅ Server is listening on http://localhost:${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use. Please close the other process or change the PORT in .env.`);
    } else {
      logger.error('Server failed to start', { error: err.message });
    }
    process.exit(1);
  });
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason: reason.stack || reason });
});

module.exports = app;
