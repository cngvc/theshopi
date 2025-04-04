import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { buyerService } from '@gateway/services/api/buyer.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

class BuyerController {
  public async getCurrentBuyer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getCurrentBuyer();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }

  public async updateBuyerAddress(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.updateBuyerAddress(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }

  public async updateBuyerPayment(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.updateBuyerPayment(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  }
}

export const buyerController = new BuyerController();
