import { ICartItem, IOrderDocument, OrderStatus, PaymentMethod } from '@cngvc/shopi-types';
import { Model, ObjectId, Schema, model } from 'mongoose';
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
          quantity: { type: Number, required: true, min: 1 },
          slug: { type: String, required: true },
          price: { type: Number, required: true, min: 0 },
          name: { type: String, required: true },
          thumb: { type: String, required: true }
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
      method: { type: String, enum: Object.values(PaymentMethod), required: true },
      paymentPublicId: { type: String },
      status: { type: String }
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: 'pending',
      index: true
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date, default: null },
    notes: { type: String }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, rec) {
        delete rec._id;
        rec.items = rec.items.map(({ _id, ...item }: { _id: ObjectId; productPublicId: string; quantity: number; price: number }) => item);
        return rec;
      }
    }
  }
);

orderSchema.pre('validate', async function (next) {
  if (this.isModified('items') || this.isModified('shippingFee')) {
    this.totalAmount =
      (this.items as ICartItem[]).reduce((sum, item) => sum + item.price! * item.quantity, 0) + Number(this.shippingFee || 0);
  }
  if (!this.orderPublicId) {
    this.orderPublicId = uuidv4();
  }
  next();
});

const OrderModel: Model<IOrderDocument> = model<IOrderDocument>('Order', orderSchema, 'Order');
export { OrderModel };
