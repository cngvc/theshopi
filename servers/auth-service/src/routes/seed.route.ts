import { authSeedController } from '@auth/controllers/auth-seed.controller';
import express, { Router } from 'express';

class SeedRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/seed/:count', authSeedController.createSeeds);
    return this.router;
  }
}

export const seedRoutes = new SeedRoutes();
