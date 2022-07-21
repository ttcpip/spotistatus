import { createLogger, format, transports, config } from 'winston';
import { consoleFormat } from 'winston-console-format';
import env from './env';

const consoleTransport = new transports.Console({
  level: env.LOG_LEVEL,
  handleExceptions: true,
  format: format.combine(
    format.colorize({ all: true }),
    format.padLevels(),
    consoleFormat({
      showMeta: true,
      metaStrip: ['timestamp'],
      inspectOptions: {
        depth: 8,
        colors: true,
        breakLength: 120,
        compact: Infinity,
      },
    }),
  ),
});

const fileTransport = new transports.File({
  level: env.LOG_LEVEL,
  handleExceptions: true,
  filename: env.LOG_FILE_PATH,
});

const logger = createLogger({
  levels: config.npm.levels,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  exitOnError: false,

  transports: [
    consoleTransport,
    ...(env.SHOULD_LOG_TO_FILE ? [fileTransport] : []),
  ],
});

export default logger;
