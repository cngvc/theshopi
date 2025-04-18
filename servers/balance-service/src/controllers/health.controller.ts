import { SERVICE_NAME } from '@balance/constants';
import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

export class HealthController {
  public health(req: Request, res: Response) {
    new OkRequestSuccess(`${SERVICE_NAME} + ' is healthy'`, {}).send(res);
  }
}

export const healthController = new HealthController();
