import { BASE_PATH } from '@order/constants/path';
import { healthRoutes } from '@order/routes/health.route';
import { Application } from 'express';
import { orderRoutes } from './routes/order.route';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, orderRoutes.routes());
};

export { appRoutes };
