import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class VerifyEmailController {
  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.verifyEmail(req.query?.token as string);
    const { message } = response.data;
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const verifyEmailController = new VerifyEmailController();
