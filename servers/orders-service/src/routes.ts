import { BASE_PATH } from '@orders/constants/path';
import { healthRoutes } from '@orders/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
