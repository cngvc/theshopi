import { BadRequestError, CreatedRequestSuccess } from '@cngvc/shopi-shared';
import { createOrderScheme } from '@cngvc/shopi-shared-types';
import { orderService } from '@order/services/order.service';
import { Request, Response } from 'express';

class OrderController {
  createOrder = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createOrderScheme.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createOrder');
    }
    const order = await orderService.createOrder(req.currentUser!.id, req.body);
    new CreatedRequestSuccess('Order has been created successfully.', { order }).send(res);
  };
}

export const orderController = new OrderController();
