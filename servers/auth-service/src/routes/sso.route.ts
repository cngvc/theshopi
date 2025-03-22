import { ssoController } from '@auth/controllers/sso.controller';
import express, { Router } from 'express';

class SSORoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/github', ssoController.githubLogin);
    this.router.get('/github/callback', ssoController.githubCallback);
    return this.router;
  }
}

export const ssoRoutes = new SSORoutes();
