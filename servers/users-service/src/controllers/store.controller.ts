import { BadRequestError, CreatedRequestSuccess, getCurrentUser, IAuthPayload, OkRequestSuccess } from '@cngvc/shopi-shared';
import { createStoreSchema, IStoreDocument } from '@cngvc/shopi-types';
import { buyerService } from '@user/services/buyer.service';
import { storeService } from '@user/services/store.service';
import { Request, Response } from 'express';

class StoreController {
  createStore = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createStoreSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createStore method error');
    }
    const currentUser = getCurrentUser(req.headers['x-user'] as string) as IAuthPayload;
    const existingStore = await storeService.getStoreByOwnerAuthId(currentUser.id);
    if (existingStore) {
      throw new BadRequestError('Store already exist. Go to your account page to update.', 'createStore method error');
    }
    const buyer = await buyerService.getBuyerByAuthId(`${currentUser.id}`);
    if (!buyer) {
      throw new BadRequestError('Buyer with auth id not found', 'createStore method error');
    }
    const store: IStoreDocument = {
      ownerAuthId: buyer.authId,
      ownerPublicId: buyer.buyerPublicId,
      email: buyer.email,
      username: buyer.username || buyer.username,
      name: req.body.name,
      description: req.body.description,
      socialLinks: req.body.socialLinks
    };
    const createdStore: IStoreDocument = await storeService.createStore(store);
    new CreatedRequestSuccess('Store has been created successfully.', { store: createdStore }).send(res);
  };

  getStoreByStorePublicId = async (req: Request, res: Response): Promise<void> => {
    const store: IStoreDocument | null = await storeService.getStoreByStorePublicId(req.params.storePublicId);
    new OkRequestSuccess('Store profile.', { store }).send(res);
  };

  getRandomStores = async (req: Request, res: Response): Promise<void> => {
    const stores: IStoreDocument[] = await storeService.getRandomStores(parseInt(req.params.size, 10));
    new OkRequestSuccess('Random stores profile.', { stores }).send(res);
  };

  updateStore = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(createStoreSchema.validate(req.body));
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
