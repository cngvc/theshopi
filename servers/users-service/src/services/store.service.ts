import { ElasticsearchIndexes, IReviewMessageDetails, IStoreDocument } from '@cngvc/shopi-shared-types';
import { elasticSearch } from '@users/elasticsearch';
import { StoreModel } from '@users/models/store.schema';
import { buyerService } from '@users/services/buyer.service';
import mongoose from 'mongoose';

class StoreService {
  getStoreById = async (storeId: string): Promise<IStoreDocument | null> => {
    const store: IStoreDocument | null = (await StoreModel.findOne({
      _id: new mongoose.Types.ObjectId(storeId)
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
    const createdStore: IStoreDocument = (await StoreModel.create(payload)) as IStoreDocument;
    await elasticSearch.addItemToIndex(ElasticsearchIndexes.stores, `${createdStore._id}`, {
      username: createdStore.username,
      email: createdStore.email,
      ownerId: createdStore.ownerId,
      authOwnerId: createdStore.authOwnerId,
      description: createdStore.description,
      ratingsCount: createdStore.ratingsCount,
      ratingSum: createdStore.ratingSum,
      ratingCategories: createdStore.ratingCategories,
      socialLinks: createdStore.socialLinks,
      completedOrders: createdStore.completedOrders,
      cancelledOrders: createdStore.cancelledOrders,
      totalEarnings: createdStore.totalEarnings,
      totalProducts: createdStore.totalProducts
    });
    await buyerService.updateBuyerBecomeStore(`${createdStore.ownerId}`, `${createdStore._id}`);
    return createdStore;
  };

  updateStore = async (storeId: string, payload: IStoreDocument): Promise<IStoreDocument> => {
    const updatedStore: IStoreDocument = (await StoreModel.findOneAndUpdate(
      { _id: storeId },
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

  updateTotalProductsCount = async (storeId: string, count: number): Promise<void> => {
    await StoreModel.updateOne({ _id: storeId }, { $inc: { totalProducts: count } }).exec();
  };

  updateStoreCancelledJobsProp = async (storeId: string): Promise<void> => {
    await StoreModel.updateOne({ _id: storeId }, { $inc: { cancelledOrders: 1 } }).exec();
  };

  updateStoreReview = async (data: IReviewMessageDetails): Promise<void> => {
    const ratingTypes: Record<string, string> = {
      '1': 'one',
      '2': 'two',
      '3': 'three',
      '4': 'four',
      '5': 'five'
    };
    const ratingKey: string = ratingTypes[`${data.rating}`];
    await StoreModel.updateOne(
      { _id: data.storeId },
      {
        $inc: {
          ratingsCount: 1,
          ratingSum: data.rating,
          [`ratingCategories.${ratingKey}.value`]: data.rating,
          [`ratingCategories.${ratingKey}.count`]: 1
        }
      }
    ).exec();
  };
}

export const storeService = new StoreService();
