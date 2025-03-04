import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

export class TokenController {
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getRefreshToken();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const tokenController = new TokenController();
