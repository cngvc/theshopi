import { cartService } from '@cart/services/cart.service';
import { ICartItem } from '@cngvc/shopi-shared-types';
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
      const items = await cartService.getCart(call.request.authId);
      if (!items) {
        return callback({ code: status.NOT_FOUND, message: 'Cart items not found' });
      }
      callback(null, { items });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
