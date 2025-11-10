import { createApp } from '@infra/app';
import { config } from '../settings-core/env';
import APP_TITLE from './app-infrastructure/const/app-title';
import { connectToMongo } from './db/mongoose';
import { setupProcessHandlers } from '@infra/app-sys/process-handlers';
import { logger } from '@logger/index';

setupProcessHandlers();

async function main() {
  await connectToMongo();
  const app = createApp();
  app.listen(config.port, () => {
    logger.info(`${APP_TITLE.launchServer} ${APP_TITLE.localUrl}:${config.port}`);
  });
}

main().catch((err) => {
  logger.error({ err }, APP_TITLE.startupError);
  process.exit(1);
});
