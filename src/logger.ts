import { createLogger, format, transports, config } from 'winston';
import { consoleFormat } from 'winston-console-format';
import { serializeError } from 'serialize-error';
import TelegramLogger from 'winston-telegram';
import { markdownv2 } from 'telegram-format';
import env from './env';

const logger = createLogger({
  levels: config.npm.levels,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
  ),
  exitOnError: false,
});

const consoleTransport = () =>
  new transports.Console({
    level: env.LOG_LEVEL,
    handleExceptions: true,
    stderrLevels: ['error'],
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
    format: format.combine(
      format.json({
        replacer: (_, value) => serializeError(value, { maxDepth: 7 }),
      }),
    ),
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
      const header = `${params.level}: ${params.message}`;
      const serialized = serializeError(info, { maxDepth: 4 });
      delete serialized.err?.stack;
      delete serialized.timestamp;
      delete serialized.level;
      const msg = `${header}\n${JSON.stringify(serialized, null, 2)}`;
      return markdownv2.monospaceBlock(msg);
    },
  });

logger.add(consoleTransport());
if (env.SHOULD_LOG_TO_FILE && env.LOG_FILE_PATH) logger.add(fileTransport());
if (env.LOG_ERR_TG_BOT_TOKEN && env.LOG_ERR_TG_CHAT_ID)
  logger.add(tgTransport());

export default logger;
