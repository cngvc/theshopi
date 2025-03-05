import { AuthMiddleware } from '@cngvc/shopi-shared';
import { currentUserController } from '@gateway/controllers/auth/current-user.controller';
import { passwordController } from '@gateway/controllers/auth/password.controller';
import express, { Router } from 'express';

class CurrentUserRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/me', AuthMiddleware.checkAuthentication, currentUserController.getCurrentUser);
    this.router.post('/auth/resend-email', AuthMiddleware.checkAuthentication, currentUserController.resendEmail);
    this.router.put('/auth/change-password', AuthMiddleware.checkAuthentication, passwordController.changePassword);

    return this.router;
  }
}

export const currentUserRoutes = new CurrentUserRoutes();
