import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signup(req.body);
    const { message, token } = response.data;
    req.session = { token };
    res.status(StatusCodes.CREATED).json({ message });
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signin(req.body);
    const { message, token } = response.data;
    req.session = { jwt: token };
    res.status(StatusCodes.OK).json({ message });
  }
}

export const authController = new AuthController();
