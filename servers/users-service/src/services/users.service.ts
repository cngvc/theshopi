import { IBuyerDocument, IStoreDocument } from '@cngvc/shopi-shared-types';
import { buyerService } from './buyer.service';
import { storeService } from './store.service';

class UsersService {
  getRandomUsers = async (size: number): Promise<{ stores: IStoreDocument[]; buyers: IBuyerDocument[] }> => {
    const stores = await storeService.getRandomStores(size);
    const buyers = await buyerService.getRandomBuyers(size);
    return { stores, buyers };
  };
}

export const usersService = new UsersService();
