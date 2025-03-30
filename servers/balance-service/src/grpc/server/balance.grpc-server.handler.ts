import { balanceService } from '@balance/services/balance.service';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

interface GetUserBalanceByAuthIdRequest {
  authId: string;
}

interface GetUserBalanceByAuthIdResponse {
  balance: number;
}

export class BalanceServiceGrpcHandler {
  static getUserBalanceByAuthId = async (
    call: ServerUnaryCall<GetUserBalanceByAuthIdRequest, GetUserBalanceByAuthIdResponse>,
    callback: sendUnaryData<GetUserBalanceByAuthIdResponse>
  ) => {
    try {
      const { authId } = call.request;
      const balance = await balanceService.getUserBalance(authId);
      callback(null, { balance });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
