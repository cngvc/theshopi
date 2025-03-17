import { CreatedRequestSuccess, getCurrentUser, IAuthPayload } from '@cngvc/shopi-shared';
import { orderService } from '@order/services/order.service';
import { Request, Response } from 'express';

class OrderController {
  createOrder = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const order = await orderService.createOrder(currentUser.id, req.body);
    new CreatedRequestSuccess('Order has been created successfully.', { order }).send(res);
  };
}

export const orderController = new OrderController();
