import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class AuthSeedController {
  public async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.createSeeds(req.params.count as string);
    const { message } = response.data;
    new OkRequestSuccess(message, {}).send(res);
  }
}

export const authSeedController = new AuthSeedController();
