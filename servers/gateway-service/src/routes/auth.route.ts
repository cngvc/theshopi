import { authController } from '@gateway/controllers/auth/auth.controller';
import { passwordController } from '@gateway/controllers/auth/password.controller';
import { verifyEmailController } from '@gateway/controllers/auth/verify-email.controller';
import express, { Router } from 'express';

const asyncHandler = (fn: any) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
};

class AuthRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signup', authController.signup);
    this.router.post('/auth/signin', authController.signin);
    this.router.get('/auth/verify-email', verifyEmailController.verifyEmail);

    this.router.put('/auth/forgot-password', passwordController.forgotPassword);
    this.router.put('/auth/reset-password/:token', passwordController.resetPassword);
    return this.router;
  }
}

export const authRoute = new AuthRoutes();
