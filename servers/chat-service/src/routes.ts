import { BASE_PATH } from '@chat/constants/path';
import { chatRoutes } from '@chat/routes/chat.route';
import { healthRoutes } from '@chat/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, chatRoutes.routes());
};

export { appRoutes };
