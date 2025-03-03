import { ExchangeNames, RoutingKeys } from '@cngvc/shopi-shared';
import { productProducer } from '@products/queues/product.producer';
import { productChannel } from '@products/server';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

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
    res.status(StatusCodes.OK).json({ message: 'Products creating was handled by message queue.' });
  };
}

export const productSeedController = new ProductSeedController();
