const logger = require('../utils/logger');

/**
 * HTTP request logger middleware.
 * Logs method, URL, status, and response time for every request.
 */
const requestLogger = (req, res, next) => {
  const startAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startAt;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http';

    logger.log(level, `${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
    });
  });

  next();
};

module.exports = requestLogger;
