import { authService } from '@auth/services/auth.service';
import { IAuthPayload } from '@cngvc/shopi-shared';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

interface GetCurrentUserByTokenRequest {
  token: string;
}

interface GetCurrentUserByTokenResponse {
  payload?: IAuthPayload | null;
}

export class AuthServiceGrpcHandler {
  static findCurrentUserByToken = async (
    call: ServerUnaryCall<GetCurrentUserByTokenRequest, GetCurrentUserByTokenResponse>,
    callback: sendUnaryData<GetCurrentUserByTokenResponse>
  ) => {
    try {
      const { token } = call.request;
      if (!token) {
        callback(null, { payload: null });
      }
      const payload = await authService.verifyUserByToken(token);
      callback(null, { payload });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
