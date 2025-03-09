import { IOrderDocument, IOrderItem, OrderStatus } from '@cngvc/shopi-shared-types';
import { Model, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const orderSchema: Schema = new Schema(
  {
    orderPublicId: { type: String, unique: true, index: true, default: uuidv4 },
    buyerPublicId: { type: String, required: true },
    buyerAuthId: { type: String, required: true },
    items: {
      type: [
        {
          productPublicId: { type: String, required: true },
          name: { type: String, required: true },
          quantity: { type: Number, required: true, min: 1 },
          price: { type: Number, required: true, min: 0 }
        }
      ],
      default: []
    },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0 },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: false, default: '' }
    },
    payment: {
      method: { type: String, required: true },
      transactionId: { type: String, default: null }
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: 'pending',
      index: true
    },
    paidAt: { type: Date, default: null },
    notes: { type: String }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, rec) {
        delete rec._id;
        return rec;
      }
    }
  }
);

orderSchema.pre('validate', async function (next) {
  this.totalAmount =
    (this.items as IOrderItem[]).reduce((sum, item) => sum + item.price * item.quantity, 0) + Number(this.shippingFee || 0);
  if (!this.orderPublicId) {
    this.orderPublicId = uuidv4();
  }
  next();
});

const OrderModel: Model<IOrderDocument> = model<IOrderDocument>('Order', orderSchema, 'Order');
export { OrderModel };
