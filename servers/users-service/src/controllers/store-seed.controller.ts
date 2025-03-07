import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { IBuyerDocument, IStoreDocument } from '@cngvc/shopi-shared-types';
import { faker } from '@faker-js/faker';
import { buyerService } from '@users/services/buyer.service';
import { storeService } from '@users/services/store.service';
import { log } from '@users/utils/logger.util';
import { Request, Response } from 'express';

class StoreSeedController {
  createSeeds = async (req: Request, res: Response): Promise<void> => {
    const { count } = req.params;
    const buyers: IBuyerDocument[] = await buyerService.getRandomBuyers(parseInt(count, 10));
    for (let i = 0; i < buyers.length; i++) {
      const buyer: IBuyerDocument = buyers[i];
      const checkIfStoreExist: IStoreDocument | null = await storeService.getStoreByEmail(`${buyer.email}`);
      if (!checkIfStoreExist) {
        const basicDescription: string = faker.commerce.productDescription();
        const store: IStoreDocument = {
          name: faker.person.fullName(),
          username: buyer.username,
          email: buyer.email,
          ownerId: `${buyer._id}`,
          authOwnerId: `${buyer.authId}`,
          description: basicDescription.length <= 250 ? basicDescription : basicDescription.slice(0, 250),
          socialLinks: ['http://youtube.com', 'https://facebook.com']
        };
        log.info(`***Seeding store:*** - ${i + 1} of ${buyers.length}`);
        await storeService.createStore(store);
      }
    }
    new OkRequestSuccess('Stores created successfully.', {}).send(res);
  };
}
export const storeSeedController = new StoreSeedController();
