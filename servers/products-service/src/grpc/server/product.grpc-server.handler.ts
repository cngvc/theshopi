import { ElasticsearchIndexes, IProductDocument } from '@cngvc/shopi-shared-types';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { elasticSearch } from '@product/elasticsearch';
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
        products = await productService.getProductsByProductPublicIds(call.request.productPublicIds);
      }
      if (!products?.length) {
        return callback({ code: status.NOT_FOUND, message: 'Products not found' });
      }
      callback(null, { products });
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
