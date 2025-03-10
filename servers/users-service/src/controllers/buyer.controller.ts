import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { IBuyerDocument } from '@cngvc/shopi-shared-types';
import { buyerService } from '@user/services/buyer.service';
import { Request, Response } from 'express';

class BuyerController {
  getBuyerByEmail = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByEmail(req.currentUser!.email);
    new OkRequestSuccess('Buyer profile.', { buyer }).send(res);
  };

  getCurrentBuyer = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByUsername(req.currentUser!.username);
    new OkRequestSuccess('Current buyer profile.', { buyer }).send(res);
  };

  getBuyerByUsername = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByUsername(req.params.username);
    new OkRequestSuccess('Buyer profile.', { buyer }).send(res);
  };
}

export const buyerController = new BuyerController();
