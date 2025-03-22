import { authController } from '@gateway/controllers/auth/auth.controller';
import express, { Router } from 'express';

class SSORoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/auth/github', authController.github);
    this.router.get('/auth/github/callback', authController.githubCallback);
    return this.router;
  }
}

export const ssoRoute = new SSORoutes();
