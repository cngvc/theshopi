import { buyerService } from '@gateway/services/api/buyer.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class BuyerController {
  public async getBuyerByEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByEmail();
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }

  public async getCurrentBuyer(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getCurrentBuyer();
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }

  public async getBuyerByUsername(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }
}

export const buyerController = new BuyerController();
