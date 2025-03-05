import { AuthMiddleware } from '@cngvc/shopi-shared';
import { authSeedController } from '@gateway/controllers/auth/auth-seed.controller';
import { productSeedController } from '@gateway/controllers/products/products-seed.controller';
import { storeSeedController } from '@gateway/controllers/users/store-seed.controller';
import express, { Router } from 'express';

class SeedRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/auth/seed/:count', AuthMiddleware.checkAuthentication, authSeedController.createSeeds);
    this.router.put('/store/seed/:count', AuthMiddleware.checkAuthentication, storeSeedController.createSeeds);
    this.router.put('/products/seed/:count', AuthMiddleware.checkAuthentication, productSeedController.createSeeds);
    return this.router;
  }
}

export const seedRoutes = new SeedRoutes();
