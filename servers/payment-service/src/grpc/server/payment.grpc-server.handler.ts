import { PaymentMethod } from '@cngvc/shopi-types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { paymentService } from '@payment/services/payment.service';

interface CreatePaymentRequest {
  orderPublicId: string;
  method: string;
  totalAmount: number;
  currency: string;
}

interface CreatePaymentResponse {
  paymentPublicId: string;
  status: string;
}

export class PaymentServiceGrpcHandler {
  static createPayment = async (
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResponse>,
    callback: sendUnaryData<CreatePaymentResponse>
  ) => {
    try {
      const { orderPublicId, method, totalAmount, currency } = call.request;
      const payment = await paymentService.createPaymentService({ orderPublicId, method: method as PaymentMethod, totalAmount, currency });
      return callback(null, {
        paymentPublicId: payment.paymentPublicId!,
        status: payment.status!
      });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
