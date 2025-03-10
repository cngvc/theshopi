import { orderController } from '@orders/controllers/order.controller';
import express, { Router } from 'express';

class OrderRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/', orderController.createOrder);
    return this.router;
  }
}

export const orderRoutes = new OrderRoutes();
