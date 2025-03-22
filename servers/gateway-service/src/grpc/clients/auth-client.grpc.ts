import { IAuthPayload } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { captureError } from '@gateway/utils/logger.util';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/auth.proto');

interface GetCurrentUserByTokenResponse {
  payload?: IAuthPayload | null;
}

interface IClient extends grpc.Client {
  GetCurrentUserByJwt: (
    request: { token: string; fingerprint?: string },
    callback: (error: grpc.ServiceError | null, response: GetCurrentUserByTokenResponse) => void
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
    this.client = new this.proto[service](config.AUTH_BASE_URL_GRPC, grpc.credentials.createInsecure());
  }

  getCurrentUserByJwt = async (token: string, fingerprint?: string): Promise<GetCurrentUserByTokenResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetCurrentUserByJwt({ token, fingerprint }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getCurrentUserByJwt');
    }
    return { payload: null };
  };
}
export const grpcAuthClient = new GrpcClient(path.join(PROTO_PATH), 'auth', 'AuthService');
