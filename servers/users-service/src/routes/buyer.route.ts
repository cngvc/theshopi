import { buyerController } from '@user/controllers/buyer.controller';
import express, { Router } from 'express';

class BuyerRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/me', buyerController.getCurrentBuyer);
    this.router.put('/shipping-address', buyerController.updateBuyerAddress);
    this.router.put('/payment', buyerController.updateBuyerPayment);
    return this.router;
  }
}

export const buyerRoutes = new BuyerRoutes();
