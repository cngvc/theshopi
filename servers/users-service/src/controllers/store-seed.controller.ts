import { OkRequestSuccess } from '@cngvc/shopi-shared';
import { IBuyerDocument, IStoreDocument } from '@cngvc/shopi-types';
import { faker } from '@faker-js/faker';
import { buyerService } from '@user/services/buyer.service';
import { storeService } from '@user/services/store.service';
import { log } from '@user/utils/logger.util';
import { Request, Response } from 'express';

class StoreSeedController {
  createSeeds = async (req: Request, res: Response): Promise<void> => {
    const { count } = req.params;
    const buyers: IBuyerDocument[] = await buyerService.getRandomBuyers(parseInt(count, 10));
    for (let i = 0; i < buyers.length; i++) {
      const buyer: IBuyerDocument = buyers[i];
      const checkIfStoreExist: IStoreDocument | null = await storeService.getStoreByOwnerAuthId(`${buyer.authId}`);
      if (!checkIfStoreExist) {
        const basicDescription: string = faker.commerce.productDescription();
        const store: IStoreDocument = {
          name: faker.person.fullName(),
          username: buyer.username,
          email: buyer.email,
          ownerAuthId: `${buyer.authId}`,
          ownerPublicId: `${buyer.buyerPublicId}`,
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
