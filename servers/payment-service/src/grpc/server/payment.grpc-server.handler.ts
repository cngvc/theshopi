import { ICartItem } from '@cngvc/shopi-types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

interface GetCartByAuthIdRequest {
  authId: string;
}

interface GetCartByAuthIdResponse {
  items: ICartItem[];
}

export class CartServiceGrpcHandler {
  static findCachedCartItemsByAuthId = async (
    call: ServerUnaryCall<GetCartByAuthIdRequest, GetCartByAuthIdResponse>,
    callback: sendUnaryData<GetCartByAuthIdResponse>
  ) => {
    try {
      return callback({ code: status.NOT_FOUND, message: 'Cart items not found' });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
