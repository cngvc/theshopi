import { ElasticsearchIndexes, IStoreDocument } from '@cngvc/shopi-shared-types';
import grpc from '@grpc/grpc-js';
import { elasticSearch } from '@users/elasticsearch';
import { StoreModel } from '@users/models/store.schema';

interface GetStoreByStorePublicIdRequest {
  storePublicId: string;
}

interface GetUserByStorePublicIdResponse extends IStoreDocument {}

export class UserServiceClientRPC {
  static findStoreByStorePublicId = async (
    call: grpc.ServerUnaryCall<GetStoreByStorePublicIdRequest, GetUserByStorePublicIdResponse>,
    callback: grpc.sendUnaryData<GetUserByStorePublicIdResponse>
  ) => {
    try {
      const store = await StoreModel.findOne({ storePublicId: call.request.storePublicId }, { _id: 0 }).lean();
      if (!store) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Store not found' });
      }
      await elasticSearch.addItemToIndex(ElasticsearchIndexes.stores, `${store.storePublicId}`, store);
      callback(null, store as IStoreDocument);
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
