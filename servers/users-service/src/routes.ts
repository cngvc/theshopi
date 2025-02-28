import { healthRoutes } from '@users/routes/health.route';
import { Application } from 'express';
import { BASE_PATH } from './constants/path';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
