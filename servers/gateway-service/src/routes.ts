import { BASE_PATH } from '@gateway/constants/path';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import { authRoute } from '@gateway/routes/auth.route';
import { buyerRoutes } from '@gateway/routes/buyer.route';
import { currentUserRoutes } from '@gateway/routes/current-user.route';
import { healthRoutes } from '@gateway/routes/health.route';
import { productRoutes } from '@gateway/routes/product.route';
import { seedRoutes } from '@gateway/routes/seed.routes';
import { storeRoutes } from '@gateway/routes/store.route';
import { tokenRoutes } from '@gateway/routes/token.route';
import { Application } from 'express';

export const appRoutes = (app: Application) => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, authRoute.routes());

  app.use(BASE_PATH, authMiddleware.verifySessionJWT, seedRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifySessionJWT, tokenRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifySessionJWT, storeRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifySessionJWT, buyerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifySessionJWT, currentUserRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifySessionJWT, productRoutes.routes());
};
