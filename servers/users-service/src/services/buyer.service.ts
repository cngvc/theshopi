import { ElasticsearchIndexes, IBuyerDocument } from '@cngvc/shopi-shared-types';
import { elasticSearch } from '@users/elasticsearch';
import { BuyerModel } from '@users/models/buyer.schema';

class BuyerService {
  getBuyerByUsername = async (authId: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ authId }).lean()) as IBuyerDocument;
    return buyer;
  };

  getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ email }).lean()) as IBuyerDocument;
    return buyer;
  };

  getBuyerByAuthId = async (authId: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ authId }).lean()) as IBuyerDocument;
    return buyer;
  };

  getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
    const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]);
    return buyers;
  };

  createBuyer = async (payload: IBuyerDocument): Promise<void> => {
    const checkIfBuyerExist: IBuyerDocument | null = await this.getBuyerByAuthId(`${payload.authId}`);
    if (!checkIfBuyerExist) {
      await BuyerModel.create(payload);
      await elasticSearch.addItemToIndex(ElasticsearchIndexes.auth, `${payload.authId}`, {
        username: payload.username,
        email: payload.email,
        storePublicId: payload.storePublicId
      });
    }
  };

  updateBuyerBecomeStore = async (buyerPublicId: string, storePublicId: string): Promise<void> => {
    await BuyerModel.updateOne(
      { buyerPublicId: buyerPublicId },
      {
        $set: {
          storePublicId: storePublicId
        }
      }
    ).exec();
  };

  updateBuyerPurchasedProductsProp = async (buyerPublicId: string, purchasedProductPublicId: string, type: string): Promise<void> => {
    await BuyerModel.updateOne(
      { buyerPublicId: buyerPublicId },
      type === 'purchased-product'
        ? {
            $push: {
              purchasedProducts: purchasedProductPublicId
            }
          }
        : {
            $pull: {
              purchasedProducts: purchasedProductPublicId
            }
          }
    ).exec();
  };
}

export const buyerService = new BuyerService();
