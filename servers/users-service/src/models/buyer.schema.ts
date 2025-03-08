import { IBuyerDocument } from '@cngvc/shopi-shared-types';
import mongoose, { model } from 'mongoose';

const buyerSchema: mongoose.Schema = new mongoose.Schema(
  {
    authId: { type: String, required: true, index: true },
    storeId: { type: String },
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);
const BuyerModel: mongoose.Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };
