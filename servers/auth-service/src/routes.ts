import { BASE_PATH } from '@auth/constants/path';
import { authRoutes } from '@auth/routes/auth.route';
import { currentUserRoutes } from '@auth/routes/current-user.route';
import { healthRoutes } from '@auth/routes/health.route';
import { seedRoutes } from '@auth/routes/seed.route';
import { tokenRoutes } from '@auth/routes/token.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, seedRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, currentUserRoutes.routes());
  app.use(BASE_PATH, tokenRoutes.routes());
};

export { appRoutes };
