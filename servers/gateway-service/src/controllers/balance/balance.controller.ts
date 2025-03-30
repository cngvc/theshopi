import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { balanceService } from '@gateway/services/api/balance.service';
import { Request, Response } from 'express';

class BalanceController {
  getCurrentUserBalance = async (req: Request, res: Response) => {
    const response = await balanceService.getCurrentUserBalance();
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  depositBalance = async (req: Request, res: Response) => {
    const response = await balanceService.depositBalance(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  withdrawBalance = async (req: Request, res: Response) => {
    const response = await balanceService.withdrawBalance(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
  transferBalance = async (req: Request, res: Response) => {
    const response = await balanceService.transferBalance(req.body);
    new OkRequestSuccess(response.data.message, response.data.metadata).send(res);
  };
}

export const balanceController = new BalanceController();
