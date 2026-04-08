const { createLogger, format, transports, addColors } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, printf, colorize, errors, splat } = format;

// ── CONFIGURATION ────────────────────────────────────────────────────────────
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'error' : 'debug');
const ENABLE_FILE_LOGGING = process.env.ENABLE_FILE_LOGGING === 'true' && NODE_ENV !== 'production';

console.log(`🔍 Logger Initialized: ENV=${NODE_ENV}, LEVEL=${LOG_LEVEL}, FILE_LOGS=${ENABLE_FILE_LOGGING}`);

// ── Custom log levels (adds 'http' between info=2 and verbose=4) ─────────────
const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  colors: { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'cyan' },
};
addColors(customLevels.colors);

// ── Pretty console format ─────────────────────────────────────────────────────
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const ts = timestamp.slice(11, 23); // HH:MM:SS.mmm
  return stack
    ? `${ts} [${level}]: ${message}\n${stack}`
    : `${ts} [${level}]: ${message}`;
});

// ── Structured JSON format for log files ─────────────────────────────────────
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  errors({ stack: true }),
  splat(),
  format.json()
);

// ── Prepare transports array ─────────────────────────────────────────────────
const transportsList = [
  // Console transport (always enabled)
  new transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'HH:mm:ss.SSS' }),
      errors({ stack: true }),
      consoleFormat
    ),
    silent: NODE_ENV === 'test',
    level: LOG_LEVEL,
  }),
];

// ── Daily rotating file transports (only in development, if enabled) ────────
if (ENABLE_FILE_LOGGING && NODE_ENV !== 'production') {
  const logsDir = path.join(__dirname, '../../logs');

  const infoRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'info-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
    level: 'info',
    format: fileFormat,
  });

  const errorRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '30d',
    level: 'error',
    format: fileFormat,
  });

  transportsList.push(infoRotateTransport, errorRotateTransport);
}

// ── Exception & Rejection Handlers ───────────────────────────────────────────
const exceptionHandlers = ENABLE_FILE_LOGGING && NODE_ENV !== 'production' ? [
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs', 'exceptions-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    format: fileFormat,
  })
] : [];

const rejectionHandlers = ENABLE_FILE_LOGGING && NODE_ENV !== 'production' ? [
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs', 'rejections-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    format: fileFormat,
  })
] : [];

// ── Create the logger ────────────────────────────────────────────────────────
const logger = createLogger({
  levels: customLevels.levels,
  level: LOG_LEVEL,
  defaultMeta: { service: 'CareerFlow-AI' },
  transports: transportsList,
  exceptionHandlers,
  rejectionHandlers,
  exitOnError: false,
});

module.exports = logger;