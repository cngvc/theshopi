import { verifyGatewayRequest } from '@cngvc/shopi-shared';
import { BASE_PATH, BUYER_BASE_PATH, STORE_BASE_PATH } from '@users/constants/path';
import { buyerRoutes } from '@users/routes/buyer.route';
import { healthRoutes } from '@users/routes/health.route';
import { storeRoutes } from '@users/routes/store.route';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, verifyGatewayRequest, healthRoutes.routes());
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes.routes());
  app.use(STORE_BASE_PATH, verifyGatewayRequest, storeRoutes.routes());
};

export { appRoutes };
