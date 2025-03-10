import { buyerController } from '@user/controllers/buyer.controller';
import express, { Router } from 'express';

class BuyerRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/email', buyerController.getBuyerByEmail);
    this.router.get('/me', buyerController.getCurrentBuyer);
    this.router.get('/:username', buyerController.getBuyerByUsername);
    return this.router;
  }
}

export const buyerRoutes = new BuyerRoutes();
