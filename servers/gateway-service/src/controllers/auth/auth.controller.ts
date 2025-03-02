import { authService } from '@gateway/services/api/auth.service';
import { log } from '@gateway/utils/logger.util';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signup(req.body);
    const { message, token, id } = response.data;
    req.session = { token };
    res.status(StatusCodes.CREATED).json({ message, id });
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signin(req.body);
    const { message, token, id } = response.data;
    req.session = { jwt: token };
    log.info(`User ${id} has logged in.`);
    res.status(StatusCodes.OK).json({ message, id });
  }
}

export const authController = new AuthController();
