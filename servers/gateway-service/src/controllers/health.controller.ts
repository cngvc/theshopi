import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { SERVICE_NAME } from '@gateway/constants';
import { Request, Response } from 'express';

class HealthController {
  public health(_: Request, res: Response) {
    new OkRequestSuccess(SERVICE_NAME + ' is healthy', {}).send(res);
  }
}
export const healthController = new HealthController();
