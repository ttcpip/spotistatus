import { Logger } from 'telegram';
import { LogLevel } from 'telegram/extensions/Logger';
import logger from '../logger';

export class TgClientLogger extends Logger {
  log(level_: LogLevel, message_: string): void {
    const lvl =
      level_ === LogLevel.DEBUG
        ? 'debug'
        : level_ === LogLevel.ERROR
        ? 'error'
        : level_ === LogLevel.INFO
        ? 'info'
        : 'warn';
    const message = `Tg client: ${message_}`;
    logger.log(lvl, message);
  }
}
