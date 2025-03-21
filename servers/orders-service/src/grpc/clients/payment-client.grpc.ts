import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { config } from '@order/config';
import { captureError } from '@order/utils/logger.util';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/payment.proto');

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
  private proto: Record<string, any>;

  constructor(protoPath: string, packageName: string, service: string) {
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
    this.proto = grpc.loadPackageDefinition(packageDefinition)[packageName];
    this.client = new this.proto[service](config.PAYMENT_BASE_URL_GRPC, grpc.credentials.createInsecure());
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
export const grpcPaymentClient = new GrpcClient(path.join(PROTO_PATH), 'payment', 'PaymentService');
