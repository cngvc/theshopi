import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { buyerService } from '@gateway/services/api/buyer.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class BuyerController {
  public async getBuyerByEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByEmail();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }

  public async getCurrentBuyer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getCurrentBuyer();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }

  public async getBuyerByUsername(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByUsername(req.params.username);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const buyerController = new BuyerController();
