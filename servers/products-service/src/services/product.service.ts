import { ExchangeNames, IPaginateProps, RoutingKeys } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes, IProductDocument, IStoreDocument } from '@cngvc/shopi-shared-types';
import { faker } from '@faker-js/faker';
import { elasticSearch } from '@products/elasticsearch';
import { ProductModel } from '@products/models/product.schema';
import { productProducer } from '@products/queues/product.producer';
import { productChannel } from '@products/server';
import { searchService } from '@products/services/search.service';
import { log } from '@products/utils/logger.util';
import { sample } from 'lodash';
import slugify from 'slugify';

class ProductService {
  createProduct = async (product: IProductDocument): Promise<IProductDocument> => {
    const newProduct: IProductDocument = await ProductModel.create(product);
    if (newProduct) {
      await productProducer.publishDirectMessage(
        productChannel,
        ExchangeNames.USERS_STORE_UPDATE,
        RoutingKeys.USERS_STORE_UPDATE,
        JSON.stringify({ type: 'update-store-product-count', storeId: `${newProduct.storeId}`, count: 1 })
      );
      const data = newProduct.toJSON?.();
      await elasticSearch.client.addItemToIndex(ElasticsearchIndexes.products, `${newProduct._id}`, data);
    }
    return newProduct;
  };
  deleteProduct = async (productId: string, storeId: string): Promise<void> => {
    await ProductModel.deleteOne({ _id: productId }).exec();
    await productProducer.publishDirectMessage(
      productChannel,
      ExchangeNames.USERS_STORE_UPDATE,
      RoutingKeys.USERS_STORE_UPDATE,
      JSON.stringify({ type: 'update-store-product-count', storeId: `${storeId}`, count: 1 })
    );
    await elasticSearch.client.deleteIndexedItem(ElasticsearchIndexes.products, productId);
  };

  getProductByIdentifier = async (identifier: string): Promise<IProductDocument> => {
    const product: IProductDocument = await elasticSearch.client.getIndexedData<IProductDocument>(
      ElasticsearchIndexes.products,
      identifier
    );
    return product;
  };

  getStoreProducts = async (storeId: string): Promise<IProductDocument[]> => {
    const queryResults = await searchService.productsSearchByStoreId(storeId);
    const products: IProductDocument[] = [];
    for (const item of queryResults.hits) {
      products.push(item._source as IProductDocument);
    }
    return products;
  };

  updateProduct = async (productId: string, payload: IProductDocument): Promise<IProductDocument> => {
    const document: IProductDocument = (await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          thumb: payload.thumb,
          quantity: payload.quantity,
          isPublished: payload.isPublished,
          categories: payload.categories || [],
          tags: payload.tags || []
        }
      },
      { new: true }
    ).exec()) as IProductDocument;

    if (document) {
      const data = document.toJSON?.() as IProductDocument;
      await elasticSearch.client.updateIndexedItem(ElasticsearchIndexes.products, `${document._id}`, data);
    }

    return document;
  };

  async createSeeds(stores: IStoreDocument[]): Promise<void> {
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
      const product: IProductDocument = {
        storeId: store._id,
        name: name,
        description: description,
        price: parseInt(faker.commerce.price({ min: 20, max: 100, dec: 0 })),
        ratingsCount: (i + 1) % 4 === 0 ? rating!['count'] : 0,
        ratingSum: (i + 1) % 4 === 0 ? rating!['sum'] : 0,
        isPublished: sample([true, false]),
        quantity: faker.number.int({ min: 10, max: 1000 }),
        thumb: faker.image.urlPicsumPhotos(),
        categories: [faker.commerce.product()],
        tags: [faker.commerce.productMaterial()],
        slug: slugify(name, { lower: true })
      };
      log.info(`***Seeding product:*** - ${i + 1} of ${stores.length}`);
      await this.createProduct(product);
    }
  }

  getProducts = async (searchQuery: string, paginate: IPaginateProps, min?: number, max?: number): Promise<IProductDocument[]> => {
    const queryResults = await searchService.productsSearch(searchQuery, paginate, min, max);
    const products: IProductDocument[] = [];
    for (const item of queryResults.hits) {
      products.push(item._source as IProductDocument);
    }
    return products;
  };
}

export const productService = new ProductService();
