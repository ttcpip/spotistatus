import { msToMMSS } from './helpers/msToMMSS';
import logger from './logger';
import { SpotifyClient } from './SpotifyClient';
import { TgClient } from './TgClient/TgClient';
import env from './env';

export class Worker {
  private static WORK_TIMEOUT_MS = 15000;
  static async init() {
    this.work();
    logger.info(`Worker started working`);
  }

  private static async work() {
    try {
      const { body } = await SpotifyClient.instance.getMyCurrentPlayingTrack();
      let status = env.DEFAULT_TG_STATUS;

      if (body.item?.type === 'track' && body.is_playing) {
        const duration = msToMMSS(body.item.duration_ms);
        const progress = msToMMSS(body.progress_ms || 0);
        const song = body.item.name;
        const artist = body.item.artists.map((e) => e.name).join(', ');
        status = `🎧 Spotify | ${artist} — ${song} | ${progress}/${duration}`;
      }

      logger.info(`Set tg status: ${status}`);
      await TgClient.setBio(status);
    } catch (err) {
      logger.error(`Worker error:`, err);
    } finally {
      setTimeout(this.work.bind(this), this.WORK_TIMEOUT_MS);
    }
  }
}
