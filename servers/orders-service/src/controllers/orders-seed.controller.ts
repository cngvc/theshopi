import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class OrderSeedController {
  createdSeeds = async (req: Request, res: Response): Promise<void> => {
    new OkRequestSuccess('Seed orders created successfully.', {}).send(res);
  };
}

export const orderSeedController = new OrderSeedController();
