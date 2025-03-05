import { BASE_PATH } from '@chat/constants/path';
import { healthRoutes } from '@chat/routes/health.route';
import { chatRoutes } from '@chat/routes/message';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, chatRoutes.routes());
};

export { appRoutes };
