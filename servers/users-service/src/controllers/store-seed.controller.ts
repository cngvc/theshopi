import { BadRequestError, IBuyerDocument, IStoreDocument } from '@cngvc/shopi-shared';
import { faker } from '@faker-js/faker';
import { buyerService } from '@users/services/buyer.service';
import { storeService } from '@users/services/store.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

class StoreSeedController {
  createSeeds = async (req: Request, res: Response): Promise<void> => {
    const { count } = req.params;
    const buyers: IBuyerDocument[] = await buyerService.getRandomBuyers(parseInt(count, 10));
    for (let i = 0; i < buyers.length; i++) {
      const buyer: IBuyerDocument = buyers[i];
      const checkIfStoreExist: IStoreDocument | null = await storeService.getStoreByEmail(`${buyer.email}`);
      if (checkIfStoreExist) {
        throw new BadRequestError('Store already exist.', 'StoreSeed store() method error');
      }
      const basicDescription: string = faker.commerce.productDescription();
      const store: IStoreDocument = {
        profilePublicId: uuidv4(),
        fullName: faker.person.fullName(),
        username: buyer.username,
        email: buyer.email,
        profilePicture: buyer.profilePicture,
        description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
        responseTime: parseInt(faker.commerce.price({ min: 1, max: 5, dec: 0 })),
        socialLinks: ['http://youtube.com', 'https://facebook.com']
      };
      await storeService.createStore(store);
    }
    res.status(StatusCodes.CREATED).json({ message: 'Stores created successfully' });
  };
}
export const storeSeedController = new StoreSeedController();
