import { config } from '@chat/config';
import { captureError } from '@chat/utils/logger.util';
import { authProto } from '@cngvc/shopi-shared';
import { IConversationParticipant } from '@cngvc/shopi-types/build/src/chat.interface';
import * as grpc from '@grpc/grpc-js';

interface GetParticipantsByAuthIdsResponse {
  participants: IConversationParticipant[];
}

interface IClient extends grpc.Client {
  GetParticipantsByAuthIds: (
    request: { authIds: string[] },
    callback: (error: grpc.ServiceError | null, response: GetParticipantsByAuthIdsResponse) => void
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

  getParticipantsByAuthIds = async (authIds: string[]): Promise<GetParticipantsByAuthIdsResponse> => {
    try {
      return await new Promise((resolve, reject) => {
        this.client.GetParticipantsByAuthIds({ authIds }, (err, response) => {
          if (err) return reject(err);
          return resolve(response);
        });
      });
    } catch (error) {
      captureError(error, 'getParticipantsByAuthIds');
    }
    return { participants: [] };
  };
}
export const grpcAuthClient = new GrpcClient('AuthService');
