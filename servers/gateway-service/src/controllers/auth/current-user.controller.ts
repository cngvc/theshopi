import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

export class CurrentUserController {
  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getCurrentUser();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }

  public async resendEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.resendEmail();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const currentUserController = new CurrentUserController();
