import { BadRequestError, CreatedRequestSuccess, OkRequestSuccess } from '@cngvc/shopi-shared';
import { IStoreDocument, storeSchema } from '@cngvc/shopi-shared-types';
import { buyerService } from '@users/services/buyer.service';
import { storeService } from '@users/services/store.service';
import { Request, Response } from 'express';

class StoreController {
  createStore = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(storeSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createStore method error');
    }
    const existingStore = await storeService.getStoreByEmail(req.body.email);
    if (existingStore) {
      throw new BadRequestError('Store already exist. Go to your account page to update.', 'createStore method error');
    }
    const buyer = await buyerService.getBuyerByAuthId(`${req.currentUser!.id}`);
    if (!buyer) {
      throw new BadRequestError('Buyer with auth id not found', 'createStore method error');
    }
    const store: IStoreDocument = {
      ownerAuthId: buyer.authId,
      ownerPublicId: buyer.buyerPublicId,
      username: req.body.username || buyer.username,
      name: req.body.name,
      email: req.body.email || buyer.email,
      description: req.body.description,
      socialLinks: req.body.socialLinks
    };
    const createdStore: IStoreDocument = await storeService.createStore(store);
    new CreatedRequestSuccess('Store has been created successfully.', { store: createdStore }).send(res);
  };

  getStoreById = async (req: Request, res: Response): Promise<void> => {
    const store: IStoreDocument | null = await storeService.getStoreById(req.params.storePublicId);
    new OkRequestSuccess('Store profile.', { store }).send(res);
  };

  getStoreByUsername = async (req: Request, res: Response): Promise<void> => {
    const store: IStoreDocument | null = await storeService.getStoreByUsername(req.params.username);
    new OkRequestSuccess('Store profile.', { store }).send(res);
  };

  getRandomStores = async (req: Request, res: Response): Promise<void> => {
    const stores: IStoreDocument[] = await storeService.getRandomStores(parseInt(req.params.size, 10));
    new OkRequestSuccess('Random stores profile.', { stores }).send(res);
  };

  updateStore = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(storeSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'updateStore method error');
    }
    const store: IStoreDocument = {
      name: req.body.name,
      description: req.body.description,
      socialLinks: req.body.socialLinks
    };
    const updatedStore: IStoreDocument = await storeService.updateStore(req.params.storePublicId, store);
    new OkRequestSuccess('Store has been updated successfully.', { store: updatedStore }).send(res);
  };
}

export const storeController = new StoreController();
