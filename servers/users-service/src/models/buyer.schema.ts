import { IBuyerDocument } from '@cngvc/shopi-shared-types';
import mongoose, { model } from 'mongoose';

const buyerSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    isStore: { type: Boolean, default: false },
    purchasedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date }
  },
  {
    versionKey: false
  }
);
const BuyerModel: mongoose.Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };
