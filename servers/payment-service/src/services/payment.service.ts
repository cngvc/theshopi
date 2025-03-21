import { IPaymentDocument, PaymentMethod } from '@cngvc/shopi-types';
import { PaymentModel } from '@payment/models/payment.schema';

class PaymentService {
  async createPaymentService(payload: {
    orderPublicId: string;
    method: PaymentMethod;
    totalAmount: number;
    currency: string;
  }): Promise<IPaymentDocument> {
    const payment = await PaymentModel.create({
      orderPublicId: payload.orderPublicId,
      method: payload.method,
      totalAmount: payload.totalAmount,
      currency: payload.currency
    });
    return payment;
  }
}

export const paymentService = new PaymentService();
