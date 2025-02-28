import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthSeedController {
  public async createSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.createSeeds(req.params.count as string);
    const { message } = response.data;
    res.status(StatusCodes.OK).json({ message });
  }
}

export const authSeedController = new AuthSeedController();
