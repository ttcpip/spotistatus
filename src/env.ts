import { config } from 'dotenv';
import { cleanEnv, str } from 'envalid';

config();

const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  LOG_LEVEL: str(),
});

export default env;
