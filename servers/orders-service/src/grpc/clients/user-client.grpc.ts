import { userProto } from '@cngvc/shopi-shared';
import { IBuyerDocument } from '@cngvc/shopi-types';
import * as grpc from '@grpc/grpc-js';
import { config } from '@order/config';
import { captureError } from '@order/utils/logger.util';

interface IClient extends grpc.Client {
  GetBuyerByAuthId: (request: { authId: string }, callback: (error: grpc.ServiceError | null, response: IBuyerDocument) => void) => void;
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

  getBuyerByAuthId = async (authId: string): Promise<IBuyerDocument | null> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetBuyerByAuthId({ authId }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getBuyerByAuthId');
    }
    return null;
  };
}
export const grpcUserClient = new GrpcClient('UserService');
