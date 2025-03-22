import { authController } from '@auth/controllers/auth.controller';
import { passwordController } from '@auth/controllers/password.controller';
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
    this.router.post('/signout', authController.logout);

    this.router.put('/verify-email', verifyEmailController.verifyEmail);
    this.router.put('/forgot-password', passwordController.forgotPassword);
    this.router.put('/reset-password/:token', passwordController.resetPassword);
    this.router.put('/change-password', passwordController.changePassword);

    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
