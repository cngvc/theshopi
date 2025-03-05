import { BASE_PATH } from '@online-status/constants/path';
import { healthRoutes } from '@online-status/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
