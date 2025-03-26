import { cartProto } from '@cngvc/shopi-shared';
import { ICartItem } from '@cngvc/shopi-types';
import * as grpc from '@grpc/grpc-js';
import { config } from '@order/config';
import { captureError } from '@order/utils/logger.util';

interface GetCartByAuthIdResponse {
  items: ICartItem[];
}

interface IClient extends grpc.Client {
  GetCartItemsByAuthId: (
    request: { authId: string },
    callback: (error: grpc.ServiceError | null, response: GetCartByAuthIdResponse) => void
  ) => void;
}

class GrpcClient {
  public client: IClient;

  constructor(service: string) {
    const serviceConstructor = cartProto as grpc.GrpcObject;
    this.client = new (serviceConstructor[service] as grpc.ServiceClientConstructor)(
      `${config.CART_BASE_URL_GRPC}`,
      grpc.credentials.createInsecure()
    ) as unknown as IClient;
  }

  getCartByAuthId = async (authId: string): Promise<GetCartByAuthIdResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetCartItemsByAuthId({ authId }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getCartByAuthId');
    }
    return { items: [] };
  };
}
export const grpcCartClient = new GrpcClient('CartService');
