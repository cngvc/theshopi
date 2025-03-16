import { ElasticsearchIndexes, IBuyerDocument, IStoreDocument } from '@cngvc/shopi-types';
import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { elasticSearch } from '@user/elasticsearch';
import { BuyerModel } from '@user/models/buyer.schema';
import { StoreModel } from '@user/models/store.schema';

interface GetStoreByStorePublicIdRequest {
  storePublicId: string;
}

interface GetStoreByStorePublicIdResponse extends IStoreDocument {}

interface GetBuyerByAuthIdRequest {
  authId: string;
}

interface GetBuyerByAuthIdResponse extends IBuyerDocument {}

export class UserServiceGrpcHandler {
  static findStoreByStorePublicId = async (
    call: ServerUnaryCall<GetStoreByStorePublicIdRequest, GetStoreByStorePublicIdResponse>,
    callback: sendUnaryData<GetStoreByStorePublicIdResponse>
  ) => {
    try {
      const store = await StoreModel.findOne({ storePublicId: call.request.storePublicId }, { _id: 0 }).lean();
      if (!store) {
        return callback({ code: status.NOT_FOUND, message: 'Store not found' });
      }
      await elasticSearch.indexDocument(ElasticsearchIndexes.stores, `${store.storePublicId}`, store);
      callback(null, store as IStoreDocument);
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };

  static findBuyerByAuthId = async (
    call: ServerUnaryCall<GetBuyerByAuthIdRequest, GetBuyerByAuthIdResponse>,
    callback: sendUnaryData<GetBuyerByAuthIdResponse>
  ) => {
    try {
      const buyer = await BuyerModel.findOne({ authId: call.request.authId }, { _id: 0 }).lean();
      if (!buyer) {
        return callback({ code: status.NOT_FOUND, message: 'Buyer not found' });
      }
      await elasticSearch.indexDocument(ElasticsearchIndexes.auth, `${buyer.buyerPublicId}`, buyer);
      callback(null, buyer as IBuyerDocument);
    } catch (error) {
      callback({ code: status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
