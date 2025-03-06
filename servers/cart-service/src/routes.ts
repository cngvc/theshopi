import { BASE_PATH } from '@cart/constants/path';
import { healthRoutes } from '@cart/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
