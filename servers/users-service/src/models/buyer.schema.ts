import { IBuyerDocument } from '@cngvc/shopi-shared-types';
import { Model, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const buyerSchema: Schema = new Schema(
  {
    buyerPublicId: { type: String, unique: true, index: true, default: uuidv4 },
    authId: { type: String, required: true, index: true },
    storePublicId: { type: String, default: null },
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    purchasedProducts: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

buyerSchema.pre('validate', async function (next) {
  if (!this.buyerPublicId) {
    this.buyerPublicId = uuidv4();
  }
  next();
});

const BuyerModel: Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };
