import { BASE_PATH } from '@cart/constants/path';
import { healthRoutes } from '@cart/routes/health.route';
import { Application } from 'express';
import { cartRoutes } from './routes/cart.route';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, cartRoutes.routes());
};

export { appRoutes };
