import { AuthMiddleware } from '@cngvc/shopi-shared';
import { BASE_PATH } from '@gateway/constants/path';
import { authRoute } from '@gateway/routes/auth.route';
import { buyerRoutes } from '@gateway/routes/buyer.route';
import { currentUserRoutes } from '@gateway/routes/current-user.route';
import { healthRoutes } from '@gateway/routes/health.route';
import { productRoutes } from '@gateway/routes/product.route';
import { seedRoutes } from '@gateway/routes/seed.routes';
import { storeRoutes } from '@gateway/routes/store.route';
import { tokenRoutes } from '@gateway/routes/token.route';
import { Application, Router } from 'express';
import { chatRoutes } from './routes/chat.route';
import { productPublicRoutes } from './routes/product-public.route';

export const appRoutes = (app: Application) => {
  const publicRouter = Router();
  publicRouter.use(healthRoutes.routes());
  publicRouter.use(authRoute.routes());
  publicRouter.use(productPublicRoutes.routes());
  app.use(BASE_PATH, publicRouter);

  const privateRouter = Router();
  privateRouter.use(AuthMiddleware.verifySessionJWT);
  privateRouter.use(productRoutes.routes());
  privateRouter.use(seedRoutes.routes());
  privateRouter.use(tokenRoutes.routes());
  privateRouter.use(storeRoutes.routes());
  privateRouter.use(buyerRoutes.routes());
  privateRouter.use(currentUserRoutes.routes());
  privateRouter.use(chatRoutes.routes());
  app.use(BASE_PATH, privateRouter);
};
