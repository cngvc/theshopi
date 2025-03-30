import { CreatedRequestSuccess } from '@cngvc/shopi-shared';
import { balanceService } from '@gateway/services/api/balance.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class BalanceSeedController {
  async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await balanceService.createSeeds(req.params.count as string);
    new CreatedRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const balanceSeedController = new BalanceSeedController();
