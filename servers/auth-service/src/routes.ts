import { BASE_PATH } from '@auth/constants/path';
import { authRoutes } from '@auth/routes/auth.route';
import { healthRoutes } from '@auth/routes/health.route';
import { seedRoutes } from '@auth/routes/seed.route';
import { Application } from 'express';
import { currentUserRoutes } from './routes/current-user.route';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, seedRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, currentUserRoutes.routes());
};

export { appRoutes };
