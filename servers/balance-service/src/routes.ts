import { BASE_PATH } from '@balance/constants/path';
import { healthRoutes } from '@balance/routes/health.route';
import { Application } from 'express';
import { balanceRoutes } from './routes/balance.route';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, balanceRoutes.routes());
};

export { appRoutes };
