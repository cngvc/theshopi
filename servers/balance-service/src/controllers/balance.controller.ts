import { balanceService } from '@balance/services/balance.service';
import { BadRequestError, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { depositBalanceSchema, DepositMethod } from '@cngvc/shopi-types';
import { Request, Response } from 'express';

class BalanceController {
  getCurrentUserBalance = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const balance = await balanceService.getUserBalance(currentUser.id);
    new OkRequestSuccess('User balance', { balance }).send(res);
  };

  depositBalance = async (req: Request<{}, {}, { amount: number; method: DepositMethod }>, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(depositBalanceSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error?.details[0].message, 'depositBalance method error validation');
    }
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    await balanceService.depositBalance(currentUser.id, req.body.amount, req.body.method);
    new OkRequestSuccess('User balance has been updated', {}).send(res);
  };

  withdrawBalance = async (req: Request<{}, {}, { amount: number }>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { amount } = req.body;
    await balanceService.withdrawBalance(currentUser.id, amount);
    new OkRequestSuccess('User balance has been updated', {}).send(res);
  };

  transferBalance = async (req: Request<{}, {}, { amount: number; toAuthId: string }>, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { amount, toAuthId } = req.body;
    await balanceService.transferBalance(currentUser.id, toAuthId, amount);
    new OkRequestSuccess('Transfer successful', {}).send(res);
  };
}

export const balanceController = new BalanceController();
