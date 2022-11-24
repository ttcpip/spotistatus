import { Api, TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import env from '../env';
import { promptStr } from '../helpers/promptStr';
import logger from '../logger';
import { TgClientLogger } from './TgClientLogger';

export class TgClient {
  private static STORE_SESSION_PATH = 'data/tg-client';
  MAX_BIO_LENGTH = 140;

  private static instance_: TelegramClient | null = null;
  public static get instance(): TelegramClient {
    if (!this.instance_) throw new Error(`Instance is not initialized`);
    return this.instance_;
  }
  private static set instance(val) {
    this.instance_ = val;
  }

  static async init() {
    this.instance = new TelegramClient(
      new StoreSession(this.STORE_SESSION_PATH),
      env.TG_API_ID,
      env.TG_API_HASH,
      { connectionRetries: 5, baseLogger: new TgClientLogger() },
    );
    await this.instance.start({
      phoneNumber: () => promptStr('Enter your tg account number:'),
      phoneCode: () => promptStr('Enter tg account auth code:'),
      password: () => promptStr('Enter tg account password', true),
      onError: (err) => {
        logger.error(`Tg client error:`, { err });
      },
    });
    this.instance.session.save();
    logger.info(`Logged into telegram account`);
  }

  static async setBio(bio: string) {
    await this.instance.invoke(
      new Api.account.UpdateProfile({
        about: bio,
      }),
    );
  }
}
