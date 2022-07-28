import { createLogger, format, transports, config } from 'winston';
import { consoleFormat } from 'winston-console-format';
import TelegramLogger from 'winston-telegram';
import { markdownv2 } from 'telegram-format';
import env from './env';

const logger = createLogger({
  levels: config.npm.levels,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  exitOnError: false,
});

const consoleTransport = () =>
  new transports.Console({
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

const fileTransport = () =>
  new transports.File({
    level: env.LOG_LEVEL,
    handleExceptions: true,
    filename: env.LOG_FILE_PATH,
  });

const tgTransport = () =>
  new TelegramLogger({
    token: env.LOG_ERR_TG_BOT_TOKEN,
    chatId: env.LOG_ERR_TG_CHAT_ID,
    level: 'error',
    unique: true,
    batchingDelay: 500,
    parseMode: 'MarkdownV2',
    formatMessage(params, info) {
      const msg = `[${params.level}] [${params.message}] ${info?.stack || ''}`;
      return markdownv2.monospaceBlock(msg);
    },
  });

logger.add(consoleTransport());
if (env.SHOULD_LOG_TO_FILE && env.LOG_FILE_PATH) logger.add(fileTransport());
if (env.LOG_ERR_TG_BOT_TOKEN && env.LOG_ERR_TG_CHAT_ID)
  logger.add(tgTransport());

export default logger;
