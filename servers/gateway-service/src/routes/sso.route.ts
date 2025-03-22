import { authController } from '@gateway/controllers/auth/auth.controller';
import { userAgentMiddleware } from '@gateway/middlewares/user-agent.middleware';
import express, { Router } from 'express';

class SSORoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.use(userAgentMiddleware.attachUseragentToBody);
    this.router.get('/auth/github', authController.github);
    this.router.get('/auth/github/callback', authController.githubCallback);
    return this.router;
  }
}

export const ssoRoute = new SSORoutes();
