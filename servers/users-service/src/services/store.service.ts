import { ElasticsearchIndexes, IStoreDocument } from '@cngvc/shopi-types';
import { elasticSearch } from '@user/elasticsearch';
import { StoreModel } from '@user/models/store.schema';
import { buyerService } from '@user/services/buyer.service';

class StoreService {
  getStoreByStorePublicId = async (storePublicId: string): Promise<IStoreDocument | null> => {
    const store: IStoreDocument | null = await StoreModel.findOne({
      storePublicId: storePublicId
    }).lean();
    return store;
  };

  getStoreByOwnerAuthId = async (ownerAuthId: string): Promise<IStoreDocument | null> => {
    const store: IStoreDocument | null = (await StoreModel.findOne({ ownerAuthId }).lean()) as IStoreDocument;
    return store;
  };

  getRandomStores = async (size: number): Promise<IStoreDocument[]> => {
    const stores: IStoreDocument[] = await StoreModel.aggregate([{ $sample: { size } }]);
    return stores;
  };

  createStore = async (payload: IStoreDocument): Promise<IStoreDocument> => {
    const createdStore: IStoreDocument = (await StoreModel.create(payload)).toJSON() as IStoreDocument;
    await elasticSearch.indexDocument(ElasticsearchIndexes.stores, `${createdStore.storePublicId}`, createdStore);
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
