import { msToMMSS } from './helpers/msToMMSS';
import { SpotifyClient } from './SpotifyClient';
import { TgClient } from './TgClient/TgClient';
import { MemoryStorage } from './MemoryStorage';
import logger from './logger';
import env from './env';

export class Worker {
  private static periodicalUpdateCurrentPlayingTrackIntervalMs =
    env.PULL_PLAYING_TRACK_TIMEOUT_MS;
  private static periodicalCheckUpdateTgStatusIntervalMs = 1500;

  private static storage = new MemoryStorage();
  static async init() {
    await this.periodicalUpdateCurrentPlayingTrack();
    this.periodicalCheckUpdateTgStatus();
    logger.info(`Worker initialized`);
  }

  private static async periodicalUpdateCurrentPlayingTrack() {
    try {
      const { body } = await SpotifyClient.instance.getMyCurrentPlayingTrack();

      if (body.item?.type === 'track' && body.is_playing) {
        this.storage.data.currentPlayingTrack = {
          durationMs: body.item.duration_ms,
          progressMs: body.progress_ms || 0,
          songName: body.item.name,
          artistsNames: body.item.artists.map((e) => e.name),
        };
      } else {
        this.storage.data.currentPlayingTrack = null;
      }
    } catch (err) {
      logger.error(`Updating current playing track error:`, err);
    } finally {
      setTimeout(
        this.periodicalUpdateCurrentPlayingTrack.bind(this),
        this.periodicalUpdateCurrentPlayingTrackIntervalMs,
      );
    }
  }

  private static async periodicalCheckUpdateTgStatus() {
    try {
      if (
        Date.now() - this.storage.data.lastTimeSetTgStatusMs <
        env.SET_TG_STATUS_MIN_INTERVAL_MS
      )
        return; // goto finally block

      const track = this.storage.data.currentPlayingTrack;
      let status = env.DEFAULT_TG_STATUS;

      if (track) {
        const duration = msToMMSS(track.durationMs);
        const progress = msToMMSS(track.progressMs);
        const song = track.artistsNames;
        const artist = track.artistsNames.join(', ');
        status = `🎧 Spotify | ${artist} — ${song} | ${progress}/${duration}`;
      }

      if (status === this.storage.data.lastSetTgStatus) return;

      logger.info(`Setting tg status: ${status}`);
      await TgClient.setBio(status);
      this.storage.data.lastSetTgStatus = status;
      this.storage.data.lastTimeSetTgStatusMs = Date.now();
    } catch (err) {
      logger.error(`Checking to update tg status error:`, err);
    } finally {
      setTimeout(
        this.periodicalCheckUpdateTgStatus.bind(this),
        this.periodicalCheckUpdateTgStatusIntervalMs,
      );
    }
  }
}
