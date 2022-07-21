import { config } from 'dotenv';
import { bool, cleanEnv, num, str } from 'envalid';

config();

const env = cleanEnv(process.env, {
  SHOULD_LOG_TO_FILE: bool({ default: false }),
  LOG_FILE_PATH: str({ default: './logs/main.log' }),
  LOG_LEVEL: str({
    choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'],
    default: 'silly',
  }),

  TG_API_ID: num(),
  TG_API_HASH: str(),

  SPOTIFY_REDIRECT_URL: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
});

export default env;
