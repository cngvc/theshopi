import { BASE_PATH } from '@payment/constants/path';
import { healthRoutes } from '@payment/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
