import { CreatedRequestSuccess, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { orderService } from '@order/services/order.service';
import { Request, Response } from 'express';

class OrderController {
  createOrder = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { orderPublicId, clientSecret } = await orderService.createOrder(currentUser.id, currentUser.email, req.body);
    new CreatedRequestSuccess('Order has been created successfully.', { orderPublicId, clientSecret }).send(res);
  };

  getCurrentUserOrder = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const orders = await orderService.getCurrentUserOrders(currentUser.id);
    new OkRequestSuccess('Order list.', { orders }).send(res);
  };

  getOrderByOrderPublicId = async (req: Request, res: Response): Promise<void> => {
    const order = await orderService.getOrderByOrderPublicId(req.params.orderPublicId);
    new OkRequestSuccess('Order detail.', { order }).send(res);
  };
}

export const orderController = new OrderController();
