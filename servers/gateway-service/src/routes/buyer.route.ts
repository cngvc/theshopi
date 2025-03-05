import { AuthMiddleware } from '@cngvc/shopi-shared';
import { buyerController } from '@gateway/controllers/users/buyer.controller';
import express, { Router } from 'express';

class BuyerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/buyer/email', AuthMiddleware.checkAuthentication, buyerController.getBuyerByEmail);
    this.router.get('/buyer/me', AuthMiddleware.checkAuthentication, buyerController.getCurrentBuyer);
    this.router.get('/buyer/:username', AuthMiddleware.checkAuthentication, buyerController.getBuyerByUsername);
    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
