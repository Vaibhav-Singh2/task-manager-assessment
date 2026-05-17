import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`API server listening on ${env.PORT}`);
  });
};

bootstrap();
