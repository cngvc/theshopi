import { BASE_PATH, BUYER_BASE_PATH, STORE_BASE_PATH } from '@user/constants/path';
import { buyerRoutes } from '@user/routes/buyer.route';
import { healthRoutes } from '@user/routes/health.route';
import { storeRoutes } from '@user/routes/store.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BUYER_BASE_PATH, buyerRoutes.routes());
  app.use(STORE_BASE_PATH, storeRoutes.routes());
};

export { appRoutes };
