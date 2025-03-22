import { BASE_PATH } from '@gateway/constants/path';
import { AuthMiddleware } from '@gateway/middlewares/auth.middleware';
import { authRoute } from '@gateway/routes/auth.route';
import { buyerRoutes } from '@gateway/routes/buyer.route';
import { cartRoutes } from '@gateway/routes/cart.route';
import { chatRoutes } from '@gateway/routes/chat.route';
import { currentUserRoutes } from '@gateway/routes/current-user.route';
import { healthRoutes } from '@gateway/routes/health.route';
import { orderRoutes } from '@gateway/routes/order.route';
import { productPublicRoutes } from '@gateway/routes/product-public.route';
import { productRoutes } from '@gateway/routes/product.route';
import { seedRoutes } from '@gateway/routes/seed.routes';
import { ssoRoute } from '@gateway/routes/sso.route';
import { storePublicRoutes } from '@gateway/routes/store-public.route';
import { storeRoutes } from '@gateway/routes/store.route';
import { tokenRoutes } from '@gateway/routes/token.route';
import { Application, Router } from 'express';

export const appRoutes = (app: Application) => {
  const publicRouter = Router();
  publicRouter.use(healthRoutes.routes());
  publicRouter.use(ssoRoute.routes());
  publicRouter.use(authRoute.routes());
  publicRouter.use(productPublicRoutes.routes());
  publicRouter.use(storePublicRoutes.routes());
  publicRouter.use(tokenRoutes.routes());

  app.use(BASE_PATH, publicRouter);

  const privateRouter = Router();
  privateRouter.use(AuthMiddleware.verifyUserJwt);

  privateRouter.use(productRoutes.routes());
  privateRouter.use(storeRoutes.routes());
  privateRouter.use(buyerRoutes.routes());
  privateRouter.use(currentUserRoutes.routes());
  privateRouter.use(chatRoutes.routes());
  privateRouter.use(cartRoutes.routes());
  privateRouter.use(orderRoutes.routes());

  // seeding data
  privateRouter.use(seedRoutes.routes());
  app.use(BASE_PATH, privateRouter);
};
