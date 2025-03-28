import { balanceService } from '@balance/services/balance.service';
import { getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { Request, Response } from 'express';

class BalanceController {
  getCurrentUserBalance = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const balance = await balanceService.getCurrentUserBalance(currentUser.id);
    new OkRequestSuccess('User balance', { balance }).send(res);
  };
  depositBalance = async (req: Request<{}, {}, { amount: number }>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { amount } = req.body;
    await balanceService.depositBalance(currentUser.id, amount);
    new OkRequestSuccess('User balance has been updated', {}).send(res);
  };
  withdrawBalance = async (req: Request<{}, {}, { amount: number }>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { amount } = req.body;
    await balanceService.withdrawBalance(currentUser.id, amount);
    new OkRequestSuccess('User balance has been updated', {}).send(res);
  };
  transferBalance = async (req: Request<{}, {}, { amount: number }>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { amount } = req.body;
    await balanceService.withdrawBalance(currentUser.id, amount);
    new OkRequestSuccess('User balance has been updated', {}).send(res);
  };
}

export const balanceController = new BalanceController();
