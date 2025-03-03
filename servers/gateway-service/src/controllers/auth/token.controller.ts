import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class TokenController {
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getRefreshToken();
    res.status(StatusCodes.OK).json({ message: response.data.message, accessToken: response.data.token });
  }
}

export const tokenController = new TokenController();
