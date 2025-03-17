import { buyerController } from '@gateway/controllers/users/buyer.controller';
import express, { Router } from 'express';

class BuyerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/buyer/email', buyerController.getBuyerByEmail);
    this.router.get('/buyer/me', buyerController.getCurrentBuyer);
    this.router.get('/buyer/:username', buyerController.getBuyerByUsername);
    this.router.put('/buyer/shipping-address', buyerController.updateBuyerAddress);
    this.router.put('/buyer/payment', buyerController.updateBuyerPayment);
    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
