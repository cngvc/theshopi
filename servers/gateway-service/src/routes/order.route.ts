import { orderController } from '@gateway/controllers/order/order.controller';
import express, { Router } from 'express';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/orders/', orderController.getCurrentUserOrders);
    this.router.get('/orders/:orderPublicId', orderController.getOrderByOrderPublicId);
    this.router.post('/orders/', orderController.createOrder);
    return this.router;
  }
}

export const orderRoutes = new OrderRoutes();
