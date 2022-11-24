import { promises } from 'fs';
import SpotifyWebApi from 'spotify-web-api-node';
import env from './env';
import { fileExists } from './helpers/fileExists';
import { promptStr } from './helpers/promptStr';
import logger from './logger';

export class SpotifyClient {
  private static ACCESS_TOKEN_FILE_PATH = 'data/spotify-client/access-token';
  private static REFRESH_TOKEN_FILE_PATH = 'data/spotify-client/refresh-token';
  private static EXPIRE_TS_FILE_PATH = 'data/spotify-client/expire-ts';
  private static SCOPES = [
    'user-read-playback-state',
    'user-read-recently-played',
  ];

  private static instance_: SpotifyWebApi | null = null;
  public static get instance(): SpotifyWebApi {
    if (!this.instance_) throw new Error(`Instance is not initialized`);
    return this.instance_;
  }
  private static set instance(val) {
    this.instance_ = val;
  }

  private static async getSavedInfo() {
    const accessToken = (await fileExists(this.ACCESS_TOKEN_FILE_PATH))
      ? await promises.readFile(this.ACCESS_TOKEN_FILE_PATH, 'utf8')
      : '';
    const refreshToken = (await fileExists(this.REFRESH_TOKEN_FILE_PATH))
      ? await promises.readFile(this.REFRESH_TOKEN_FILE_PATH, 'utf8')
      : '';
    const expireTs = (await fileExists(this.EXPIRE_TS_FILE_PATH))
      ? +(await promises.readFile(this.EXPIRE_TS_FILE_PATH, 'utf8'))
      : 0;
    return { accessToken, refreshToken, expireTs };
  }
  private static async saveInfo(
    accessToken: string,
    refreshToken: string,
    expireTs: number,
  ) {
    await promises.writeFile(this.ACCESS_TOKEN_FILE_PATH, accessToken);
    await promises.writeFile(this.REFRESH_TOKEN_FILE_PATH, refreshToken);
    await promises.writeFile(this.EXPIRE_TS_FILE_PATH, `${expireTs}`);
  }

  static async init() {
    this.instance = new SpotifyWebApi({
      redirectUri: env.SPOTIFY_REDIRECT_URL,
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    });

    const saved = await this.getSavedInfo();
    if (
      saved.accessToken &&
      saved.refreshToken &&
      saved.expireTs &&
      Date.now() / 1000 < saved.expireTs
    ) {
      this.instance.setAccessToken(saved.accessToken);
      this.instance.setRefreshToken(saved.refreshToken);
      logger.info(`Logged to spotify account with previously saved info`);
    } else {
      const authUrl = this.instance.createAuthorizeURL(this.SCOPES, '');
      const gotUrl = await promptStr(
        `Enter url you were redirected to after visiting ${authUrl}:`,
      );
      const code = new URL(gotUrl).searchParams.get('code');
      if (!code) throw new Error(`Invalid url given`);

      const resp = await this.instance.authorizationCodeGrant(code);
      this.instance.setAccessToken(resp.body.access_token);
      this.instance.setRefreshToken(resp.body.refresh_token);
      await this.saveInfo(
        resp.body.access_token,
        resp.body.refresh_token,
        Math.round(Date.now() / 1000 + resp.body.expires_in),
      );

      logger.info(`Logged to spotify account`);
    }
    const { expireTs } = await this.getSavedInfo();
    const expiresIn = Math.round(expireTs - Date.now() / 1000);
    logger.info(`Spotify access token expires in ${expiresIn} seconds`);

    setTimeout(this.refreshToken.bind(this), expiresIn * 0.95 * 1000);
  }

  private static async refreshToken() {
    try {
      const resp = await this.instance.refreshAccessToken();
      this.instance.setAccessToken(resp.body.access_token);
      const refreshToken =
        resp.body.refresh_token || this.instance.getRefreshToken() || '';
      this.instance.setRefreshToken(refreshToken);

      const expireTs = Math.round(Date.now() / 1000 + resp.body.expires_in);
      await this.saveInfo(resp.body.access_token, refreshToken, expireTs);

      logger.info(
        `Spotify client token refreshed! New token expires in ${resp.body.expires_in}`,
        { body: resp.body },
      );
      setTimeout(
        this.refreshToken.bind(this),
        resp.body.expires_in * 0.95 * 1000,
      );
    } catch (err) {
      logger.error(`Spotify client token refreshing error:`, { err });
    }
  }
}
