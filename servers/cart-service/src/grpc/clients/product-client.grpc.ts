import { config } from '@cart/config';
import { captureError } from '@cart/utils/logger.util';
import { IProductDocument } from '@cngvc/shopi-shared-types';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/product.proto');

interface GetProductsByProductPublicIdsResponse {
  products: IProductDocument[];
}

interface IClient extends grpc.Client {
  GetProductsByProductPublicIds: (
    request: { productPublicIds: string[]; useCaching: boolean },
    callback: (error: grpc.ServiceError | null, response: GetProductsByProductPublicIdsResponse) => void
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
    this.client = new this.proto[service](config.PRODUCT_BASE_URL_GRPC, grpc.credentials.createInsecure());
  }

  getProductsByProductPublicIds = async (productPublicIds: string[], useCaching = true): Promise<GetProductsByProductPublicIdsResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetProductsByProductPublicIds({ productPublicIds, useCaching: true }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getProductsByProductPublicIds');
    }
    return { products: [] };
  };
}
export const grpcProductClient = new GrpcClient(path.join(PROTO_PATH), 'product', 'ProductService');
