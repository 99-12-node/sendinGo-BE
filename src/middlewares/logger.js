const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// ref. https://lovemewithoutall.github.io/it/winston-example/
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  level: 'debug',
  filename: `${logDir}/%DATE%-smart-push.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '3d',
});

const logger = createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
    dailyRotateFileTransport,
  ],
});

module.exports = { logger };
