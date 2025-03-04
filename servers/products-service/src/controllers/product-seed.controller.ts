import { ExchangeNames, OkRequestSuccess, RoutingKeys } from '@cngvc/shopi-shared';
import { productProducer } from '@products/queues/product.producer';
import { productChannel } from '@products/server';
import { Request, Response } from 'express';

class ProductSeedController {
  createdSeeds = async (req: Request, res: Response): Promise<void> => {
    await productProducer.publishDirectMessage(
      productChannel,
      ExchangeNames.GET_STORE_USERS,
      RoutingKeys.GET_STORE_USERS,
      JSON.stringify({
        count: req.params.count
      }),
      'Message to make user service calls to create seeds with store users.'
    );
    new OkRequestSuccess('Products creating was handled by message queue.', {}).send(res);
  };
}

export const productSeedController = new ProductSeedController();
