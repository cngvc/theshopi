import { authController } from '@auth/controllers/auth.controller';
import { verifyEmailController } from '@auth/controllers/verify-email.controller';
import express, { Router } from 'express';

class AuthRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', authController.signup);
    this.router.post('/signin', authController.signin);
    this.router.put('/verify-email', verifyEmailController.verifyEmail);
    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
