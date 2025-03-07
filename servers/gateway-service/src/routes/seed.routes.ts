import { AuthMiddleware } from '@cngvc/shopi-shared';
import { authSeedController } from '@gateway/controllers/auth/auth-seed.controller';
import { chatSeedController } from '@gateway/controllers/chat/chat-seed.controller';
import { productSeedController } from '@gateway/controllers/product/product-seed.controller';
import { storeSeedController } from '@gateway/controllers/users/store-seed.controller';
import express, { Router } from 'express';

class SeedRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.use(AuthMiddleware.checkAuthentication);
    this.router.put('/auth/seed/:count', authSeedController.createSeeds);
    this.router.put('/store/seed/:count', storeSeedController.createSeeds);
    this.router.put('/products/seed/:count', productSeedController.createSeeds);
    this.router.put('/chat/seed/:count', chatSeedController.createSeeds);
    return this.router;
  }
}

export const seedRoutes = new SeedRoutes();
