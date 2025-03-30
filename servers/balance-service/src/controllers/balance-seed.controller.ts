import { balanceProducer } from '@balance/queues/balance.producer';
import { balanceChannel } from '@balance/server';
import { ExchangeNames, OkRequestSuccess, RoutingKeys } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class BalanceSeedController {
  createdSeeds = async (req: Request, res: Response): Promise<void> => {
    await balanceProducer.publishDirectMessage(
      balanceChannel,
      ExchangeNames.GET_USERS,
      RoutingKeys.GET_USERS,
      JSON.stringify({
        count: req.params.count,
        type: 'balance'
      })
    );
    new OkRequestSuccess('Seed balance created successfully.', {}).send(res);
  };
}

export const balanceSeedController = new BalanceSeedController();
