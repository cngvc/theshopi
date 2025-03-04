import { currentUserController } from '@gateway/controllers/auth/current-user.controller';
import { passwordController } from '@gateway/controllers/auth/password.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class CurrentUserRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/me', authMiddleware.checkAuthentication, currentUserController.getCurrentUser);
    this.router.post('/auth/resend-email', authMiddleware.checkAuthentication, currentUserController.resendEmail);
    this.router.put('/auth/change-password', authMiddleware.checkAuthentication, passwordController.changePassword);

    return this.router;
  }
}

export const currentUserRoutes = new CurrentUserRoutes();
