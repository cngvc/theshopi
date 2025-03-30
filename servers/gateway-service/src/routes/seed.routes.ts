import { authSeedController } from '@gateway/controllers/auth/auth-seed.controller';
import { balanceSeedController } from '@gateway/controllers/balance/balance-seed.controller';
import { chatSeedController } from '@gateway/controllers/chat/chat-seed.controller';
import { productSeedController } from '@gateway/controllers/product/product-seed.controller';
import { superSeedController } from '@gateway/controllers/super-seed.controller';
import { storeSeedController } from '@gateway/controllers/users/store-seed.controller';
import express, { Router } from 'express';

class SeedRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/auth/seed/:count', authSeedController.createSeeds);
    this.router.put('/store/seed/:count', storeSeedController.createSeeds);
    this.router.put('/products/seed/:count', productSeedController.createSeeds);
    this.router.put('/chat/seed/:count', chatSeedController.createSeeds);
    this.router.put('/balance/seed/:count', balanceSeedController.createSeeds);

    this.router.put('/super/seed/:count', superSeedController.createSeeds);

    return this.router;
  }
}

export const seedRoutes = new SeedRoutes();
