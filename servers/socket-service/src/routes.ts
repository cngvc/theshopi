import { BASE_PATH } from '@socket/constants/path';
import { healthRoutes } from '@socket/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
