import { IPaymentDocument, OrderStatus, PaymentMethod } from '@cngvc/shopi-types';
import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const paymentSchema = new Schema(
  {
    paymentPublicId: {
      type: String,
      unique: true,
      index: true,
      default: uuidv4
    },
    orderPublicId: {
      type: String,
      required: true,
      index: true
    },
    transactionId: {
      type: String,
      default: null
    },
    paymentIntentId: {
      type: String,
      default: null
    },
    method: { type: String, enum: PaymentMethod, required: true },
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: OrderStatus,
      default: 'pending'
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret._id;
        return ret;
      }
    }
  }
);

paymentSchema.pre('validate', function (next) {
  if (!this.paymentPublicId) {
    this.paymentPublicId = uuidv4();
  }
  next();
});

const PaymentModel = model<IPaymentDocument>('Payment', paymentSchema, 'Payment');

export { PaymentModel };
