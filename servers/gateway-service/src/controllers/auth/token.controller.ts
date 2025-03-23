import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

export class TokenController {
  public async rotateRefreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const response: AxiosResponse = await authService.rotateRefreshToken(refreshToken);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const tokenController = new TokenController();
