import { ElasticsearchIndexes, IBuyerDocument, IStoreDocument } from '@cngvc/shopi-shared-types';
import grpc from '@grpc/grpc-js';
import { elasticSearch } from '@users/elasticsearch';
import { BuyerModel } from '@users/models/buyer.schema';
import { StoreModel } from '@users/models/store.schema';

interface GetStoreByStorePublicIdRequest {
  storePublicId: string;
}

interface GetStoreByStorePublicIdResponse extends IStoreDocument {}

interface GetBuyerByAuthIdRequest {
  authId: string;
}

interface GetBuyerByAuthIdResponse extends IBuyerDocument {}

export class UserServiceClientRPC {
  static findStoreByStorePublicId = async (
    call: grpc.ServerUnaryCall<GetStoreByStorePublicIdRequest, GetStoreByStorePublicIdResponse>,
    callback: grpc.sendUnaryData<GetStoreByStorePublicIdResponse>
  ) => {
    try {
      const store = await StoreModel.findOne({ storePublicId: call.request.storePublicId }, { _id: 0 }).lean();
      if (!store) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Store not found' });
      }
      await elasticSearch.indexDocument(ElasticsearchIndexes.stores, `${store.storePublicId}`, store);
      callback(null, store as IStoreDocument);
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, message: 'Internal Server Error' });
    }
  };

  static findBuyerByAuthId = async (
    call: grpc.ServerUnaryCall<GetBuyerByAuthIdRequest, GetBuyerByAuthIdResponse>,
    callback: grpc.sendUnaryData<GetBuyerByAuthIdResponse>
  ) => {
    try {
      const buyer = await BuyerModel.findOne({ authId: call.request.authId }, { _id: 0 }).lean();
      if (!buyer) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Buyer not found' });
      }
      await elasticSearch.indexDocument(ElasticsearchIndexes.auth, `${buyer.buyerPublicId}`, buyer);
      callback(null, buyer as IBuyerDocument);
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, message: 'Internal Server Error' });
    }
  };
}
