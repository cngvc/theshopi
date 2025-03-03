import { BASE_PATH } from '@products/constants/path';
import { healthRoutes } from '@products/routes/health.route';
import { Application } from 'express';
import { productRoutes } from './routes/product.route';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, productRoutes.routes());
};

export { appRoutes };
