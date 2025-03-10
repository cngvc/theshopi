import { ExchangeNames, OkRequestSuccess, RoutingKeys } from '@cngvc/shopi-shared';
import { productProducer } from '@product/queues/product.producer';
import { productChannel } from '@product/server';
import { Request, Response } from 'express';

class ProductSeedController {
  createdSeeds = async (req: Request, res: Response): Promise<void> => {
    await productProducer.publishDirectMessage(
      productChannel,
      ExchangeNames.GET_STORE_USERS,
      RoutingKeys.GET_STORE_USERS,
      JSON.stringify({
        count: req.params.count
      })
    );
    new OkRequestSuccess('Products creating was handled by message queue.', {}).send(res);
  };
}

export const productSeedController = new ProductSeedController();
