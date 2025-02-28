import { BASE_PATH } from '@notification/constants/path';
import { healthRoutes } from '@notification/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
