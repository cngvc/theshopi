import { buyerController } from '@gateway/controllers/users/buyer.controller';
import { authMiddleware } from '@gateway/middlewares/auth.middleware';
import express, { Router } from 'express';

class BuyerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/buyer/email', authMiddleware.checkAuthentication, buyerController.getBuyerByEmail);
    this.router.get('/buyer/me', authMiddleware.checkAuthentication, buyerController.getCurrentBuyer);
    this.router.get('/buyer/:username', authMiddleware.checkAuthentication, buyerController.getBuyerByUsername);
    return this.router;
  }
}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
