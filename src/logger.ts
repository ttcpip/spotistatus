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

const logger = createLogger({
  levels: config.npm.levels,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  exitOnError: false,

  transports: [consoleTransport],
});

export default logger;
