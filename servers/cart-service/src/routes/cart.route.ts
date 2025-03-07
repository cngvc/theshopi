import { cartController } from '@cart/controllers/cart.controller';
import express, { Router } from 'express';

class CartRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/', cartController.getCart);
    this.router.post('/', cartController.addToCart);
    this.router.put('/', cartController.updateCart);
    this.router.put('/increase', cartController.increaseItemInCart);
    this.router.put('/decrease', cartController.decreaseItemInCart);
    this.router.put('/remove-item', cartController.removeItemInCart);
    return this.router;
  }
}

export const cartRoutes = new CartRoutes();
