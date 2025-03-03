import { authSeedController } from '@gateway/controllers/auth/auth-seed.controller';
import { productSeedController } from '@gateway/controllers/products/products-seed.controller';
import { storeSeedController } from '@gateway/controllers/users/store-seed.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class SeedRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/auth/seed/:count', authMiddleware.checkAuthentication, authSeedController.createSeeds);
    this.router.put('/store/seed/:count', authMiddleware.checkAuthentication, storeSeedController.createSeeds);
    this.router.put('/products/seed/:count', authMiddleware.checkAuthentication, productSeedController.createSeeds);
    return this.router;
  }
}

export const seedRoutes = new SeedRoutes();
