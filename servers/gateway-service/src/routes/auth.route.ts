import { authController } from '@gateway/controllers/auth/auth.controller';
import express, { Router } from 'express';

class AuthRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signout', authController.signout);
    return this.router;
  }
}

export const authRoute = new AuthRoutes();
