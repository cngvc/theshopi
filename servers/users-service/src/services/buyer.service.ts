import { IBuyerDocument } from '@cngvc/shopi-shared';
import { BuyerModel } from '@users/models/buyer.schema';

class BuyerService {
  getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ email }).exec()) as IBuyerDocument;
    return buyer;
  };

  getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
    const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ username }).exec()) as IBuyerDocument;
    return buyer;
  };

  getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
    const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]);
    return buyers;
  };

  createBuyer = async (payload: IBuyerDocument): Promise<void> => {
    const checkIfBuyerExist: IBuyerDocument | null = await this.getBuyerByEmail(`${payload.email}`);
    if (!checkIfBuyerExist) {
      await BuyerModel.create(payload);
    }
  };

  updateBuyerIsStoreProp = async (email: string): Promise<void> => {
    await BuyerModel.updateOne(
      { email },
      {
        $set: {
          isStore: true
        }
      }
    ).exec();
  };

  updateBuyerPurchasedProductsProp = async (buyerId: string, purchasedProductId: string, type: string): Promise<void> => {
    await BuyerModel.updateOne(
      { _id: buyerId },
      type === 'purchased-product'
        ? {
            $push: {
              purchasedProducts: purchasedProductId
            }
          }
        : {
            $pull: {
              purchasedProducts: purchasedProductId
            }
          }
    ).exec();
  };
}

export const buyerService = new BuyerService();
