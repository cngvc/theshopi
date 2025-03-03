import { authService } from '@gateway/services/api/auth.service';
import { log } from '@gateway/utils/logger.util';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signup(req.body);
    const { message, accessToken, user } = response.data;
    log.info(`User ${user?.username} has signed up.`);
    res.status(StatusCodes.CREATED).json({ message, user, accessToken });
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signin(req.body);
    const { message, accessToken, user } = response.data;
    log.info(`User ${user?.username} has logged in.`);
    res.status(StatusCodes.OK).json({ message, user, accessToken });
  }
}

export const authController = new AuthController();
