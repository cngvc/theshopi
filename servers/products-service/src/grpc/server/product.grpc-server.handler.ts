import { IProductDocument } from '@cngvc/shopi-shared-types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { productService } from '@product/services/product.service';

interface GetProductsByProductPublicIdsRequest {
  productPublicIds: string[];
  useCaching: boolean;
}

interface GetProductsByProductPublicIdsResponse {
  products: IProductDocument[];
}

export class ProductServiceGrpcHandler {
  static findProductsByProductPublicIds = async (
    call: ServerUnaryCall<GetProductsByProductPublicIdsRequest, GetProductsByProductPublicIdsResponse>,
    callback: sendUnaryData<GetProductsByProductPublicIdsResponse>
  ) => {
    try {
      const products = await productService.getProductsByProductPublicIds(call.request.productPublicIds);
      if (!products?.length) {
        return callback({ code: status.NOT_FOUND, message: 'Products not found' });
      }
      callback(null, { products });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
