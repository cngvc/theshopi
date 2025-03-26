import { PaymentMethod } from '@cngvc/shopi-types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { paymentService } from '@payment/services/payment.service';

interface CreatePaymentRequest {
  orderPublicId: string;
  email: string;
  method: string;
  totalAmount: number;
  currency: string;
}

interface CreatePaymentResponse {
  paymentPublicId: string;
  clientSecret: string;
  status: string;
}

export class PaymentServiceGrpcHandler {
  static createPayment = async (
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResponse>,
    callback: sendUnaryData<CreatePaymentResponse>
  ) => {
    try {
      const { orderPublicId, email, method, totalAmount, currency } = call.request;
      const payment = await paymentService.createPayment({
        orderPublicId,
        email,
        method: method as PaymentMethod,
        totalAmount,
        currency
      });
      return callback(null, {
        paymentPublicId: payment.paymentPublicId!,
        clientSecret: payment.clientSecret!,
        status: payment.status!
      });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
