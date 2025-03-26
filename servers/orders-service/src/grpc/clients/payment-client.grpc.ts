import { paymentProto } from '@cngvc/shopi-shared';
import * as grpc from '@grpc/grpc-js';
import { config } from '@order/config';
import { captureError } from '@order/utils/logger.util';

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

interface IClient extends grpc.Client {
  CreatePayment: (
    request: CreatePaymentRequest,
    callback: (error: grpc.ServiceError | null, response: CreatePaymentResponse) => void
  ) => void;
}

class GrpcClient {
  public client: IClient;

  constructor(service: string) {
    const serviceConstructor = paymentProto as grpc.GrpcObject;
    this.client = new (serviceConstructor[service] as grpc.ServiceClientConstructor)(
      `${config.PAYMENT_BASE_URL_GRPC}`,
      grpc.credentials.createInsecure()
    ) as unknown as IClient;
  }

  createPayment = async (payload: CreatePaymentRequest): Promise<CreatePaymentResponse | null> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.CreatePayment(payload, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'createPayment');
    }
    return null;
  };
}
export const grpcPaymentClient = new GrpcClient('PaymentService');
