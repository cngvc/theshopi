import { NotFoundError } from '@cngvc/shopi-shared';
import { IOrderDocument } from '@cngvc/shopi-shared-types';
import { grpcUserClient } from '@orders/grpc/grpc.client';

class OrderService {
  createOrder = async (authId: string, order: IOrderDocument): Promise<IOrderDocument> => {
    // get buyer information
    const buyer = await this.findCachedBuyerByAuthId(authId);
    console.log(buyer);

    // get cart information

    // create card
    // const newOrder = await OrderModel.create(order);

    return {} as any;
  };

  private findCachedBuyerByAuthId = async (authId: string) => {
    let buyer = null;
    if (!buyer) {
      buyer = await grpcUserClient.getBuyerByAuthId(authId);
      if (!buyer) throw new NotFoundError('Buyer not found', 'findCachedBuyerByAuthId');
    }
    return buyer;
  };
}

export const orderService = new OrderService();
