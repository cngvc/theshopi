import { BadRequestError, IStoreDocument } from '@cngvc/shopi-shared';
import { storeSchema } from '@users/schemes/store';
import { storeService } from '@users/services/store.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class StoreController {
  createStore = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(storeSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'createStore() method error');
    }
    const checkIfStoreExist: IStoreDocument | null = await storeService.getStoreByEmail(req.body.email);
    if (checkIfStoreExist) {
      throw new BadRequestError('Store already exist. Go to your account page to update.', 'createStore() method error');
    }
    const store: IStoreDocument = {
      profilePublicId: req.body.profilePublicId,
      fullName: req.body.fullName,
      username: req.currentUser!.username,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      description: req.body.description,
      country: req.body.country,
      responseTime: req.body.responseTime,
      socialLinks: req.body.socialLinks
    };
    const createdStore: IStoreDocument = await storeService.createStore(store);
    res.status(StatusCodes.CREATED).json({ message: 'Store created successfully.', store: createdStore });
  };

  getStoreById = async (req: Request, res: Response): Promise<void> => {
    const store: IStoreDocument | null = await storeService.getStoreById(req.params.storeId);
    res.status(StatusCodes.OK).json({ message: 'Store profile', store });
  };

  getStoreByUsername = async (req: Request, res: Response): Promise<void> => {
    const store: IStoreDocument | null = await storeService.getStoreByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: 'Store profile', store });
  };

  getRandomStores = async (req: Request, res: Response): Promise<void> => {
    const stores: IStoreDocument[] = await storeService.getRandomStores(parseInt(req.params.size, 10));
    res.status(StatusCodes.OK).json({ message: 'Random stores profile', stores });
  };

  updateStore = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(storeSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'updateStore() method error');
    }
    const store: IStoreDocument = {
      profilePublicId: req.body.profilePublicId,
      fullName: req.body.fullName,
      profilePicture: req.body.profilePicture,
      description: req.body.description,
      country: req.body.country,
      responseTime: req.body.responseTime,
      socialLinks: req.body.socialLinks
    };
    const updatedStore: IStoreDocument = await storeService.updateStore(req.params.storeId, store);
    res.status(StatusCodes.OK).json({ message: 'Seller created successfully.', store: updatedStore });
  };
}

export const storeController = new StoreController();
