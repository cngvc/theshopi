import { config } from '@cart/config';
import { captureError } from '@cart/utils/logger.util';
import { productProto } from '@cngvc/shopi-shared';
import { IProductDocument } from '@cngvc/shopi-types';
import * as grpc from '@grpc/grpc-js';

interface GetProductsByProductPublicIdsResponse {
  products: IProductDocument[];
}

interface IClient extends grpc.Client {
  GetProductsByProductPublicIds: (
    request: { productPublicIds: string[]; useCaching: boolean },
    callback: (error: grpc.ServiceError | null, response: GetProductsByProductPublicIdsResponse) => void
  ) => void;
  GetProductByProductPublicId: (
    request: { productPublicId: string },
    callback: (error: grpc.ServiceError | null, response: IProductDocument) => void
  ) => void;
}

class GrpcClient {
  public client: IClient;
  constructor(service: string) {
    const serviceConstructor = productProto as grpc.GrpcObject;
    this.client = new (serviceConstructor[service] as grpc.ServiceClientConstructor)(
      `${config.PRODUCT_BASE_URL_GRPC}`,
      grpc.credentials.createInsecure()
    ) as unknown as IClient;
  }

  getProductsByProductPublicIds = async (productPublicIds: string[], useCaching = true): Promise<GetProductsByProductPublicIdsResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetProductsByProductPublicIds({ productPublicIds, useCaching }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getProductsByProductPublicIds');
    }
    return { products: [] };
  };

  getProductByProductPublicId = async (productPublicId: string): Promise<IProductDocument | null> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetProductByProductPublicId({ productPublicId }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getProductByProductPublicId');
    }
    return null;
  };
}
export const grpcProductClient = new GrpcClient('ProductService');
