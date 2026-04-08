const { createLogger, format, transports, addColors } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const { combine, timestamp, printf, colorize, errors, splat } = format;

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

// ── Daily rotating file transports ───────────────────────────────────────────
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

// ── Create the logger ─────────────────────────────────────────────────────────
const logger = createLogger({
  levels: customLevels.levels,                              // register custom levels
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    ...(process.env.NODE_ENV !== 'production' ? [
      infoRotateTransport,
      errorRotateTransport,
    ] : []),
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss.SSS' }),
        errors({ stack: true }),
        consoleFormat
      ),
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
  exceptionHandlers: [
...(process.env.NODE_ENV !== 'production' ? [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      format: fileFormat,
    })
] : []),
  ],
  rejectionHandlers: [
...(process.env.NODE_ENV !== 'production' ? [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      format: fileFormat,
    })
] : []),
  ],
  exitOnError: false,
});

module.exports = logger;