import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { productService } from '@gateway/services/api/product.service';
import { storeService } from '@gateway/services/api/store.service';
import { Request, Response } from 'express';

class SuperSeedController {
  public async createSeeds(req: Request, res: Response): Promise<void> {
    // seed auth and buyers
    await authService.createSeeds(req.params.count as string);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // seed buyer -> store
    await storeService.createSeeds(req.params.count as string);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // seed product
    await productService.createSeeds(req.params.count as string);

    new OkRequestSuccess('Done', {}).send(res);
  }
}

export const superSeedController = new SuperSeedController();
