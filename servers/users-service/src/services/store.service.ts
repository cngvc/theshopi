import { ElasticsearchIndexes, IStoreDocument } from '@cngvc/shopi-shared-types';
import { elasticSearch } from '@users/elasticsearch';
import { StoreModel } from '@users/models/store.schema';
import { buyerService } from '@users/services/buyer.service';
import mongoose from 'mongoose';

class StoreService {
  getStoreById = async (storePublicId: string): Promise<IStoreDocument | null> => {
    const store: IStoreDocument | null = (await StoreModel.findOne({
      _id: new mongoose.Types.ObjectId(storePublicId)
    }).lean()) as IStoreDocument;
    return store;
  };

  getStoreByUsername = async (username: string): Promise<IStoreDocument | null> => {
    const store: IStoreDocument | null = (await StoreModel.findOne({ username }).lean()) as IStoreDocument;
    return store;
  };

  getStoreByEmail = async (email: string): Promise<IStoreDocument | null> => {
    const store: IStoreDocument | null = (await StoreModel.findOne({ email }).lean()) as IStoreDocument;
    return store;
  };

  getRandomStores = async (size: number): Promise<IStoreDocument[]> => {
    const stores: IStoreDocument[] = await StoreModel.aggregate([{ $sample: { size } }]);
    return stores;
  };

  createStore = async (payload: IStoreDocument): Promise<IStoreDocument> => {
    const createdStore: IStoreDocument = (await StoreModel.create(payload)).toJSON() as IStoreDocument;
    await elasticSearch.addItemToIndex(ElasticsearchIndexes.stores, `${createdStore.ownerAuthId}`, createdStore);
    await buyerService.updateBuyerBecomeStore(`${createdStore.ownerPublicId}`, `${createdStore.storePublicId}`);
    return createdStore;
  };

  updateStore = async (storePublicId: string, payload: IStoreDocument): Promise<IStoreDocument> => {
    const updatedStore: IStoreDocument = (await StoreModel.findOneAndUpdate(
      { storePublicId: storePublicId },
      {
        $set: {
          name: payload.name,
          description: payload.description,
          socialLinks: payload.socialLinks
        }
      },
      { new: true }
    ).exec()) as IStoreDocument;
    return updatedStore;
  };

  updateTotalProductsCount = async (storePublicId: string, count: number): Promise<void> => {
    await StoreModel.updateOne({ storePublicId: storePublicId }, { $inc: { totalProducts: count } }).exec();
  };

  updateStoreCancelledOrdersProp = async (storePublicId: string): Promise<void> => {
    await StoreModel.updateOne({ storePublicId: storePublicId }, { $inc: { cancelledOrders: 1 } }).exec();
  };
}

export const storeService = new StoreService();
