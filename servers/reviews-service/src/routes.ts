import { BASE_PATH } from '@reviews/constants/path';
import { healthRoutes } from '@reviews/routes/health.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
};

export { appRoutes };
