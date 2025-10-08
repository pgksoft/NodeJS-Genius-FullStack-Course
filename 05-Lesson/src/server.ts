import { createApp } from '@infra/app';
import { config } from './app-infrastructure/app-config';
import APP_TITLE from './app-infrastructure/const/app-title';
import { connectToMongo } from './db/mongoose';

async function main() {
  await connectToMongo();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`${APP_TITLE.launchServer} ${APP_TITLE.localUrl}:${config.port}`);
  });
}

main().catch((err) => {
  console.error(APP_TITLE.startupError, err);
});
