import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@users/constants';
import { Request, Response } from 'express';

export class HealthController {
  public health(req: Request, res: Response) {
    new OkRequestSuccess(`${SERVICE_NAME} + ' is healthy'`, {}).send(res);
  }
}

export const healthController = new HealthController();
