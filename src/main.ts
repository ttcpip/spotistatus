import 'source-map-support/register';
import env from './env';
import logger from './logger';

async function main() {
  logger.info(`↓↓↓ Starting the app... ↓↓↓`);
  logger.info(`Env: `, { env });
  logger.info(`↑↑↑ The app started! ↑↑↑`);
}

main().catch((err) => {
  logger.error(`Error at main fn:`, err);
  logger.error(`Terminating the app...`);
  process.exit(1);
});
