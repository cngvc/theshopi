import { BASE_PATH } from '@auth/constants/path';
import { healthRoutes } from '@auth/routes/health.route';
import { seedRoutes } from '@auth/routes/seed.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, seedRoutes.routes());
};

export { appRoutes };
