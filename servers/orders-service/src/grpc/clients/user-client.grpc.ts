import { IBuyerDocument } from '@cngvc/shopi-types';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { config } from '@order/config';
import { captureError } from '@order/utils/logger.util';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/user.proto');

interface IClient extends grpc.Client {
  GetBuyerByAuthId: (request: { authId: string }, callback: (error: grpc.ServiceError | null, response: IBuyerDocument) => void) => void;
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
    this.client = new this.proto[service](config.USERS_BASE_URL_GRPC, grpc.credentials.createInsecure());
  }

  getBuyerByAuthId = async (authId: string): Promise<IBuyerDocument | null> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetBuyerByAuthId({ authId }, (err: any, response: IBuyerDocument) => {
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
export const grpcUserClient = new GrpcClient(path.join(PROTO_PATH), 'user', 'UserService');
