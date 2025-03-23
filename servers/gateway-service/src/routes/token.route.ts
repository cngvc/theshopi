import { tokenController } from '@gateway/controllers/auth/token.controller';
import express, { Router } from 'express';

class TokenRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/refresh-token', tokenController.rotateRefreshToken);
    return this.router;
  }
}

export const tokenRoutes = new TokenRoutes();
