import { authProto, IAuthPayload } from '@cngvc/shopi-shared';
import { config } from '@gateway/config';
import { captureError } from '@gateway/utils/logger.util';
import * as grpc from '@grpc/grpc-js';

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
  constructor(service: string) {
    const serviceConstructor = authProto as grpc.GrpcObject;
    this.client = new (serviceConstructor[service] as grpc.ServiceClientConstructor)(
      `${config.AUTH_BASE_URL_GRPC}`,
      grpc.credentials.createInsecure()
    ) as unknown as IClient;
  }

  getCurrentUserByJwt = async (token: string, fingerprint?: string): Promise<GetCurrentUserByTokenResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        if (!token || !token.length) return reject('Token is invalid.');
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
export const grpcAuthClient = new GrpcClient('AuthService');
