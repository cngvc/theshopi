import { authSeedController } from '@gateway/controllers/auth/auth-seed.controller';
import { storeController } from '@gateway/controllers/users/store.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class SeedRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/auth/seed/:count', authMiddleware.checkAuthentication, authSeedController.createSeeds);
    this.router.put('/store/seed/:count', authMiddleware.checkAuthentication, storeController.createSeeds);
    return this.router;
  }
}

export const seedRoutes = new SeedRoutes();
