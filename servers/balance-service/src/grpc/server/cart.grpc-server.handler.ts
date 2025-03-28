import { balanceService } from '@balance/services/balance.service';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

interface UpdateUserBalanceRequest {
  authId: string;
  amount: number;
}

interface UpdateUserBalanceResponse {
  status: string;
}

export class BalanceServiceGrpcHandler {
  static updateUserBalance = async (
    call: ServerUnaryCall<UpdateUserBalanceRequest, UpdateUserBalanceResponse>,
    callback: sendUnaryData<UpdateUserBalanceResponse>
  ) => {
    try {
      const { authId, amount } = call.request;
      await balanceService.updateUserBalance(authId, amount);
      callback(null, { status: 'done' });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
