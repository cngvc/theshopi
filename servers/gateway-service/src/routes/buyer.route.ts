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
    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
