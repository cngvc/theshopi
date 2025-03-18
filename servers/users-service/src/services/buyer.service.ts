import { ElasticsearchIndexes, IBuyerDocument, IBuyerPayment, IShippingAddress } from '@cngvc/shopi-types';
import { elasticSearch } from '@user/elasticsearch';
import { BuyerModel } from '@user/models/buyer.schema';

class BuyerService {
  getBuyerByAuthId = async (authId: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = await BuyerModel.findOne({ authId }, { _id: 0 }).lean();
    return buyer;
  };

  getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
    const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]);
    return buyers;
  };

  createBuyer = async (payload: IBuyerDocument): Promise<void> => {
    const existingBuyer: IBuyerDocument | null = await this.getBuyerByAuthId(`${payload.authId}`);
    if (existingBuyer) return;
    const buyer = (await BuyerModel.create(payload)).toJSON();
    await elasticSearch.indexDocument(ElasticsearchIndexes.auth, `${buyer.buyerPublicId}`, buyer);
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

  updateBuyerShippingAddress = async (authId: string, shippingAddress: IShippingAddress): Promise<void> => {
    await BuyerModel.updateOne(
      { authId: authId },
      {
        $set: {
          shippingAddress: shippingAddress
        }
      }
    ).exec();
  };

  updateBuyerPaymentMethod = async (authId: string, payment: IBuyerPayment): Promise<void> => {
    await BuyerModel.updateOne(
      { authId: authId },
      {
        $set: {
          payment: payment
        }
      }
    ).exec();
  };
}

export const buyerService = new BuyerService();
