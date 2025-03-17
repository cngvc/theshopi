import { cartController } from '@gateway/controllers/cart/cart.controller';
import express, { Router } from 'express';

class CartRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/cart/', cartController.getCart);
    this.router.post('/cart/', cartController.addToCart);
    this.router.put('/cart/', cartController.updateCart);
    this.router.put('/cart/increase', cartController.increaseItemInCart);
    this.router.put('/cart/decrease', cartController.decreaseItemInCart);
    this.router.put('/cart/remove-item', cartController.removeItemInCart);
    return this.router;
  }
}

export const cartRoutes = new CartRoutes();
