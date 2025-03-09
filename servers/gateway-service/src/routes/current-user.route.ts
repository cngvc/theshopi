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
    this.router.use(AuthMiddleware.checkAuthentication);
    this.router.get('/auth/me', currentUserController.getCurrentUser);
    this.router.get('/auth/verify', currentUserController.checkUserExists);
    this.router.post('/auth/resend-email', currentUserController.resendEmail);
    this.router.put('/auth/change-password', passwordController.changePassword);

    return this.router;
  }
}

export const currentUserRoutes = new CurrentUserRoutes();
