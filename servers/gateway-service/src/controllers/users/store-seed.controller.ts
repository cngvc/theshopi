import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { storeService } from '@gateway/services/api/store.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class StoreSeedController {
  public async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await storeService.createSeeds(req.params.count as string);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const storeSeedController = new StoreSeedController();
