import { CreatedRequestSuccess } from '@cngvc/shopi-shared';
import { orderService } from '@gateway/services/api/order.service';
import { Request, Response } from 'express';

class OrderController {
  createOrder = async (req: Request, res: Response) => {
    const response = await orderService.createOrder(req.body);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  getCurrentUserOrders = async (req: Request, res: Response) => {
    const response = await orderService.getCurrentUserOrders();
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  getOrderByOrderPublicId = async (req: Request, res: Response) => {
    console.log(req.params.orderPublicId);
    const response = await orderService.getOrderByOrderPublicId(req.params.orderPublicId);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const orderController = new OrderController();
