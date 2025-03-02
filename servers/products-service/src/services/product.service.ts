import { ExchangeNames, IStoreProduct, RoutingKeys } from '@cngvc/shopi-shared';
import { elasticSearch } from '@products/elasticsearch';
import { ProductModel } from '@products/models/product.schema';
import { productProducer } from '@products/queues/product.producer';
import { productChannel } from '@products/server';

class ProductService {
  createProduct = async (product: IStoreProduct): Promise<IStoreProduct> => {
    const createdProduct: IStoreProduct = await ProductModel.create(product);
    if (createdProduct) {
      const data: IStoreProduct = createdProduct.toJSON?.() as IStoreProduct;
      await productProducer.publishDirectMessage(
        productChannel,
        ExchangeNames.USERS_STORE_UPDATE,
        RoutingKeys.USERS_STORE_UPDATE,
        JSON.stringify({ type: 'update-store-product-count', storeId: `${data.storeId}`, count: 1 }),
        'Details sent to users service.'
      );
      await elasticSearch.addItemToIndex('products', `${data._id}`, data);
    }
    return createdProduct;
  };

  deleteProduct = async (productId: string, storeId: string): Promise<void> => {
    await ProductModel.deleteOne({ _id: productId }).exec();
    await productProducer.publishDirectMessage(
      productChannel,
      ExchangeNames.USERS_STORE_UPDATE,
      RoutingKeys.USERS_STORE_UPDATE,
      JSON.stringify({ type: 'update-store-product-count', storeId: `${storeId}`, count: 1 }),
      'Details sent to users service.'
    );
    await elasticSearch.deleteIndexedItem('products', productId);
  };
}

export const productService = new ProductService();
