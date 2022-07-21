import 'source-map-support/register';
import logger from './logger';
import { TgClient } from './TgClient/TgClient';
import { SpotifyClient } from './SpotifyClient';
import { Worker } from './Worker';

async function main() {
  logger.info(`↓↓↓ Starting the app... ↓↓↓`);

  await TgClient.init();
  await SpotifyClient.init();
  await Worker.init();

  logger.info(`↑↑↑ The app started! ↑↑↑`);
}

main().catch((err) => {
  logger.error(`Error at main fn:`, err);
  logger.error(`Terminating the app...`);
  process.exit(1);
});
