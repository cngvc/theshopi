import { tokenController } from '@gateway/controllers/auth/token.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class TokenRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/refresh-token', authMiddleware.checkAuthentication, tokenController.refreshToken);
    return this.router;
  }
}

export const tokenRoutes = new TokenRoutes();
