import { ExchangeNames, IStoreDocument, IStoreProduct, RoutingKeys } from '@cngvc/shopi-shared';
import { faker } from '@faker-js/faker';
import { elasticSearchIndexes } from '@products/constants/elasticsearch-indexes';
import { elasticSearch } from '@products/elasticsearch';
import { ProductModel } from '@products/models/product.schema';
import { productProducer } from '@products/queues/product.producer';
import { productChannel } from '@products/server';
import { log } from '@products/utils/logger.util';
import { sample } from 'lodash';
import { elasticsearchService } from './elasticsearch.service';

class ProductService {
  createProduct = async (product: IStoreProduct): Promise<IStoreProduct> => {
    const newProduct: IStoreProduct = await ProductModel.create(product);
    if (newProduct) {
      await productProducer.publishDirectMessage(
        productChannel,
        ExchangeNames.USERS_STORE_UPDATE,
        RoutingKeys.USERS_STORE_UPDATE,
        JSON.stringify({ type: 'update-store-product-count', storeId: `${newProduct.storeId}`, count: 1 }),
        'Details sent to users service.'
      );
      const data = newProduct.toJSON?.();
      await elasticSearch.addItemToIndex(elasticSearchIndexes.products, `${newProduct._id}`, data);
    }
    return newProduct;
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
    await elasticSearch.deleteIndexedItem(elasticSearchIndexes.products, productId);
  };

  getProductById = async (productId: string): Promise<IStoreProduct> => {
    const product: IStoreProduct = await elasticSearch.getIndexedData(elasticSearchIndexes.products, productId);
    return product;
  };

  getStoreProducts = async (storeId: string): Promise<IStoreProduct[]> => {
    const products: IStoreProduct[] = [];
    const queryResults = await elasticsearchService.productsSearchByStoreId(storeId);
    for (const item of queryResults.hits) {
      products.push(item._source as IStoreProduct);
    }
    return products;
  };

  updateProduct = async (productId: string, payload: IStoreProduct): Promise<IStoreProduct> => {
    const document: IStoreProduct = (await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          thumb: payload.thumb,
          quantity: payload.quantity,
          isPublished: payload.isPublished
        }
      },
      { new: true }
    ).exec()) as IStoreProduct;

    if (document) {
      const data = document.toJSON?.() as IStoreProduct;
      await elasticSearch.updateIndexedItem(elasticSearchIndexes.products, `${document._id}`, data);
    }

    return document;
  };

  async createSeeds(stores: IStoreDocument[], count: string): Promise<void> {
    const randomRatings = [
      { sum: 20, count: 4 },
      { sum: 10, count: 2 },
      { sum: 20, count: 4 },
      { sum: 15, count: 3 },
      { sum: 5, count: 1 }
    ];
    for (let i = 0; i < stores.length; i++) {
      const store = stores[i];
      const name = faker.commerce.productName();
      const description = faker.commerce.productDescription();
      const rating = sample(randomRatings);
      const product: IStoreProduct = {
        storeId: store._id,
        name: name,
        description: description,
        price: parseInt(faker.commerce.price({ min: 20, max: 100, dec: 0 })),
        ratingsCount: (i + 1) % 4 === 0 ? rating!['count'] : 0,
        ratingSum: (i + 1) % 4 === 0 ? rating!['sum'] : 0,
        isPublished: sample([true, false]),
        quantity: faker.number.int({ min: 10, max: 1000 }),
        thumb: faker.image.urlPicsumPhotos()
      };
      log.info(`***Seeding product:*** - ${i + 1} of ${stores.length}`);
      await this.createProduct(product);
    }
  }
}

export const productService = new ProductService();
