import { IOrderDocument } from '@cngvc/shopi-shared-types';
import { OrderModel } from '@orders/models/order.schema';

class OrderService {
  createOrder = async (order: IOrderDocument): Promise<IOrderDocument> => {
    const newOrder = await OrderModel.create(order);
    return newOrder;
  };
}

export const orderService = new OrderService();
