import { ElasticsearchIndexes, IProductDocument } from '@cngvc/shopi-types';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { elasticSearch } from '@product/elasticsearch';
import { productService } from '@product/services/product.service';

interface GetProductsByProductPublicIdsRequest {
  productPublicIds: string[];
  useCaching: boolean;
}

interface GetProductByProductPublicIdRequest {
  productPublicId: string;
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
      const { productPublicIds, useCaching } = call.request;
      let products: IProductDocument[] = [];
      if (useCaching) {
        const queryList = [{ terms: { 'productPublicId.keyword': productPublicIds } }];
        const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.products, queryList);
        for (const item of hits.hits) {
          products.push(item._source as IProductDocument);
        }
      }
      if (!useCaching || !products.length) {
        products = await productService.getProductsByProductPublicIds(productPublicIds);
      }
      if (!products?.length) {
        return callback({ code: status.NOT_FOUND, message: 'Products not found' });
      }
      callback(null, { products });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };

  static findProductByProductPublicId = async (
    call: ServerUnaryCall<GetProductByProductPublicIdRequest, IProductDocument>,
    callback: sendUnaryData<IProductDocument>
  ) => {
    try {
      const { productPublicId } = call.request;
      let product = await productService.getProductByProductPublicId(productPublicId);
      if (!product) {
        return callback({ code: status.NOT_FOUND, message: 'Products not found' });
      }
      callback(null, product as IProductDocument);
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
