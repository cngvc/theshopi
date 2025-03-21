import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

export class TokenController {
  public async refreshAccessToken(req: Request, res: Response): Promise<void> {
    const { refreshToken, deviceInfo } = req.body;
    const response: AxiosResponse = await authService.refreshAccessToken(refreshToken, deviceInfo);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const tokenController = new TokenController();
