import { config } from '@balance/config';
import { captureError } from '@balance/utils/logger.util';
import { productProto } from '@cngvc/shopi-shared';
import * as grpc from '@grpc/grpc-js';

interface DepositBalanceResponse {
  status: string;
}

interface IClient extends grpc.Client {
  DepositBalance: (
    request: { authId: string; amount: number; method: string },
    callback: (error: grpc.ServiceError | null, response: DepositBalanceResponse) => void
  ) => void;
}

class GrpcClient {
  public client: IClient;
  constructor(service: string) {
    const serviceConstructor = productProto as grpc.GrpcObject;
    this.client = new (serviceConstructor[service] as grpc.ServiceClientConstructor)(
      `${config.PAYMENT_BASE_URL_GRPC}`,
      grpc.credentials.createInsecure()
    ) as unknown as IClient;
  }

  depositBalance = async (authId: string, amount: number, method: string): Promise<DepositBalanceResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.DepositBalance({ authId, amount, method }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'depositBalance');
    }
    return { status: 'error' };
  };
}
export const grpcPaymentClient = new GrpcClient('ProductService');
