import { storeService } from '@gateway/services/api/store.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class StoreSeedController {
  public async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await storeService.createSeeds(req.params.count as string);
    const { message } = response.data;
    res.status(StatusCodes.OK).json({ message });
  }
}

export const authSeedController = new StoreSeedController();
