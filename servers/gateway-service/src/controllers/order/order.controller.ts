import { CreatedRequestSuccess } from '@cngvc/shopi-shared';
import { orderService } from '@gateway/services/api/order.service';
import { Request, Response } from 'express';

class OrderController {
  createOrder = async (req: Request, res: Response) => {
    const response = await orderService.createOrder(req.body);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const orderController = new OrderController();
