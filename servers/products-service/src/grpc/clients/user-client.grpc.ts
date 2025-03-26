import { userProto } from '@cngvc/shopi-shared';
import { IStoreDocument } from '@cngvc/shopi-types';
import * as grpc from '@grpc/grpc-js';
import { config } from '@product/config';
import { captureError } from '@product/utils/logger.util';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/user.proto');

interface IClient extends grpc.Client {
  GetStoreByStorePublicId: (
    request: { storePublicId: string },
    callback: (error: grpc.ServiceError | null, response: IStoreDocument) => void
  ) => void;
}

class GrpcClient {
  public client: IClient;

  constructor(service: string) {
    const serviceConstructor = userProto as grpc.GrpcObject;
    this.client = new (serviceConstructor[service] as grpc.ServiceClientConstructor)(
      `${config.USERS_BASE_URL_GRPC}`,
      grpc.credentials.createInsecure()
    ) as unknown as IClient;
  }

  getStoreByStorePublicId = async (storePublicId: string): Promise<IStoreDocument | null> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetStoreByStorePublicId({ storePublicId }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getStoreByStorePublicId');
    }
    return null;
  };
}
export const grpcUserClient = new GrpcClient('UserService');
