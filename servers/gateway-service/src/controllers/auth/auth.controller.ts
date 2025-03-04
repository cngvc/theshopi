import { CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { log } from '@gateway/utils/logger.util';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class AuthController {
  public async signup(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signup(req.body);
    const { message, metadata } = response.data;
    log.info(`User ${metadata.user.username} has signed up.`);
    new CreatedRequestSuccess(message, metadata).send(res);
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signin(req.body);
    const { message, metadata } = response.data;
    log.info(`User ${metadata.user.username} has logged in.`);
    new OkRequestSuccess(message, metadata).send(res);
  }
}

export const authController = new AuthController();
