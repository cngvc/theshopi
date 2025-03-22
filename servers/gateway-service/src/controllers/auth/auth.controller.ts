import { CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { authService } from '@gateway/services/api/auth.service';
import { log } from '@gateway/utils/logger.util';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signup(req.body);
    const { message, metadata } = response.data;
    log.info(`User ${metadata.user.username} has signed up.`);
    new CreatedRequestSuccess(message, metadata).send(res);
  }

  async signin(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signin(req.body);
    const { message, metadata } = response.data;
    log.info(`User ${metadata.user.username} has logged in.`);
    new OkRequestSuccess(message, metadata).send(res);
  }

  async github(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.github();
    const { message, metadata } = response.data;
    new OkRequestSuccess(message, metadata).redirect(res, metadata.authUrl);
  }
  async githubCallback(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.githubCallback(req.query as Record<string, string>);
    const { message, metadata } = response.data;
    new OkRequestSuccess(message, metadata).redirect(
      res,
      `${config.CLIENT_URL}/auth/callback?accessToken=${metadata.accessToken}&refreshToken=${metadata.refreshToken}`
    );
  }
}

export const authController = new AuthController();
