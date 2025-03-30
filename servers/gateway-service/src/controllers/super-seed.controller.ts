import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { balanceService } from '@gateway/services/api/balance.service';
import { Request, Response } from 'express';

class SuperSeedController {
  public async createSeeds(req: Request, res: Response): Promise<void> {
    // seed auth and buyers
    // await authService.createSeeds(req.params.count as string);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // // seed buyer -> store
    // await storeService.createSeeds(req.params.count as string);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // // seed product
    // await productService.createSeeds(req.params.count as string);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // // seed chat
    // await chatService.createSeeds(req.params.count as string);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // seed balance
    await balanceService.createSeeds(req.params.count as string);

    new OkRequestSuccess('Done', {}).send(res);
  }
}

export const superSeedController = new SuperSeedController();
