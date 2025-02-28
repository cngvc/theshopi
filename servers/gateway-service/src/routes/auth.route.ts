import { authSeedController } from '@gateway/controllers/auth/auth-seed.controller';
import { authController } from '@gateway/controllers/auth/auth.controller';
import { verifyEmailController } from '@gateway/controllers/auth/verify-email.controller';
import express, { Router } from 'express';

class AuthRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signup', authController.signup);
    this.router.post('/auth/signin', authController.signin);
    this.router.get('/auth/verify-email', verifyEmailController.verifyEmail);
    this.router.put('/auth/seed/:count', authSeedController.createSeeds);
    return this.router;
  }
}

export const authRoute = new AuthRoutes();
