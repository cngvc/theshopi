import { IStoreDocument } from '@cngvc/shopi-types';
import { Model, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const storeSchema: Schema = new Schema(
  {
    storePublicId: { type: String, unique: true, index: true, default: uuidv4 },
    name: { type: String, require: true },
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    ownerPublicId: { type: String, required: true, index: true },
    ownerAuthId: { type: String, required: true, index: true },
    description: { type: String, required: true },
    socialLinks: [{ type: String, default: '' }],
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, rec) {
        delete rec._id;
        return rec;
      }
    }
  }
);

storeSchema.pre('validate', async function (next) {
  if (!this.storePublicId) {
    this.storePublicId = uuidv4();
  }
  next();
});

const StoreModel: Model<IStoreDocument> = model<IStoreDocument>('Store', storeSchema, 'Store');
export { StoreModel };
