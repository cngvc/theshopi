import { ICartItem } from '@cngvc/shopi-shared-types';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { config } from '@order/config';
import { captureError } from '@order/utils/logger.util';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/cart.proto');

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
    this.client = new this.proto[service](config.CART_BASE_URL_GRPC, grpc.credentials.createInsecure());
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
export const grpcCartClient = new GrpcClient(path.join(PROTO_PATH), 'cart', 'CartService');
