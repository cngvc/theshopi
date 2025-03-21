import { refreshTokenController } from '@auth/controllers/refresh-token.controller';
import express, { Router } from 'express';

class TokenRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/refresh-token', refreshTokenController.refreshAccessToken);
    return this.router;
  }
}

export const tokenRoutes = new TokenRoutes();
