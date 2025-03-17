import { BadRequestError, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { IBuyerDocument, paymentScheme, shippingAddressSchema } from '@cngvc/shopi-types';
import { buyerService } from '@user/services/buyer.service';
import { Request, Response } from 'express';

class BuyerController {
  getBuyerByEmail = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByEmail(currentUser.email);
    new OkRequestSuccess('Buyer profile.', { buyer }).send(res);
  };

  getCurrentBuyer = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByAuthId(currentUser.id);
    new OkRequestSuccess('Current buyer profile.', { buyer }).send(res);
  };

  getBuyerByUsername = async (req: Request, res: Response): Promise<void> => {
    const buyer: IBuyerDocument | null = await buyerService.getBuyerByUsername(req.params.username);
    new OkRequestSuccess('Buyer profile.', { buyer }).send(res);
  };

  updateBuyerAddress = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { error } = await Promise.resolve(shippingAddressSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error?.details[0].message, 'updateBuyerAddress method error validation');
    }
    await buyerService.updateBuyerShippingAddress(currentUser.id, req.body);
    new OkRequestSuccess('Updated buyer address.', {}).send(res);
  };

  updateBuyerPayment = async (req: Request, res: Response): Promise<void> => {
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const { error } = await Promise.resolve(paymentScheme.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error?.details[0].message, 'updateBuyerPayment method error validation');
    }
    await buyerService.updateBuyerPaymentMethod(currentUser.id, req.body);
    new OkRequestSuccess('Updated buyer payment.', {}).send(res);
  };
}

export const buyerController = new BuyerController();
