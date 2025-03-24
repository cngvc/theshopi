import { authGrpcService } from '@auth/services/auth-grpc.service';
import { IAuthPayload } from '@cngvc/shopi-shared';
import { IConversationParticipant } from '@cngvc/shopi-types/build/src/chat.interface';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

interface GetCurrentUserByTokenRequest {
  token: string;
  fingerprint?: string;
}

interface GetCurrentUserByTokenResponse {
  payload?: IAuthPayload | null;
}

interface GetParticipantsByAuthIdsRequest {
  authIds: string[];
}

interface GetParticipantsByAuthIdsResponse {
  participants: IConversationParticipant[];
}

export class AuthServiceGrpcHandler {
  static findCurrentUserByToken = async (
    call: ServerUnaryCall<GetCurrentUserByTokenRequest, GetCurrentUserByTokenResponse>,
    callback: sendUnaryData<GetCurrentUserByTokenResponse>
  ) => {
    try {
      const { token, fingerprint } = call.request;
      if (!token) {
        callback(null, { payload: null });
      }
      const payload = await authGrpcService.verifyUserByToken(token, fingerprint);
      callback(null, { payload });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };

  static findParticipantsByAuthIds = async (
    call: ServerUnaryCall<GetParticipantsByAuthIdsRequest, GetParticipantsByAuthIdsResponse>,
    callback: sendUnaryData<GetParticipantsByAuthIdsResponse>
  ) => {
    try {
      const { authIds } = call.request;
      const participants = await authGrpcService.findParticipantsByAuthIds(authIds);
      callback(null, { participants });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
