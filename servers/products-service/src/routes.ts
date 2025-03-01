import { BASE_PATH } from '@products/constants/path';
import { healthRoutes } from '@products/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
