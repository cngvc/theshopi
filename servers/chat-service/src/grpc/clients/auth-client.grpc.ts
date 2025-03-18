import { config } from '@chat/config';
import { captureError } from '@chat/utils/logger.util';
import { IConversationParticipant } from '@cngvc/shopi-types/build/src/chat.interface';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
const PROTO_PATH = path.join(__dirname, '../proto/auth.proto');

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
export const grpcAuthClient = new GrpcClient(path.join(PROTO_PATH), 'auth', 'AuthService');
