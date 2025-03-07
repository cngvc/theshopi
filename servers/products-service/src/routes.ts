import { BASE_PATH } from '@products/constants/path';
import { healthRoutes } from '@products/routes/health.route';
import { productRoutes } from '@products/routes/product.route';
import { Application } from 'express';
import { productPublicRoutes } from './routes/product-public.route';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, productRoutes.routes());
  app.use(BASE_PATH, productPublicRoutes.routes());
};

export { appRoutes };
