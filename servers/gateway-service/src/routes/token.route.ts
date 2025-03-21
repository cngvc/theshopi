import { tokenController } from '@gateway/controllers/auth/token.controller';
import { userAgentMiddleware } from '@gateway/middlewares/user-agent.middleware';
import express, { Router } from 'express';

class TokenRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.use(userAgentMiddleware.attachUseragentToBody);
    this.router.post('/auth/refresh-token', tokenController.refreshAccessToken);
    return this.router;
  }
}

export const tokenRoutes = new TokenRoutes();
