import { ExchangeNames, IPaginateProps, NotFoundError, RoutingKeys } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes, IProductDocument, IStoreDocument } from '@cngvc/shopi-shared-types';
import { faker } from '@faker-js/faker';
import { elasticSearch } from '@products/elasticsearch';
import { grpcUserClient } from '@products/grpc/grpc.client';
import { ProductModel } from '@products/models/product.schema';
import { productProducer } from '@products/queues/product.producer';
import { productChannel } from '@products/server';
import { searchService } from '@products/services/search.service';
import { log } from '@products/utils/logger.util';
import { sample } from 'lodash';
import slugify from 'slugify';

class ProductService {
  createProduct = async (product: IProductDocument): Promise<IProductDocument> => {
    const newProduct = await ProductModel.create(product);
    if (newProduct) {
      await productProducer.publishDirectMessage(
        productChannel,
        ExchangeNames.USERS_STORE_UPDATE,
        RoutingKeys.USERS_STORE_UPDATE,
        JSON.stringify({ type: 'update-store-product-count', storePublicId: `${newProduct.storePublicId}`, count: 1 })
      );
      const data = newProduct.toJSON();
      await elasticSearch.addItemToIndex(ElasticsearchIndexes.products, `${newProduct.productPublicId}`, data);
    }
    return newProduct;
  };
  deleteProduct = async (productPublicId: string, storePublicId: string): Promise<void> => {
    await ProductModel.deleteOne({ productPublicId: productPublicId }).exec();
    await productProducer.publishDirectMessage(
      productChannel,
      ExchangeNames.USERS_STORE_UPDATE,
      RoutingKeys.USERS_STORE_UPDATE,
      JSON.stringify({ type: 'update-store-product-count', storePublicId: `${storePublicId}`, count: 1 })
    );
    await elasticSearch.deleteIndexedItem(ElasticsearchIndexes.products, productPublicId);
  };

  getProductByProductPublicId = async (
    productPublicId: string
  ): Promise<{ product: IProductDocument | null; store: IStoreDocument | null }> => {
    let product: IProductDocument | null = await elasticSearch.getIndexedData<IProductDocument>(
      ElasticsearchIndexes.products,
      productPublicId
    );
    if (!product) {
      product = await ProductModel.findOne({ productPublicId: productPublicId }).lean();
      if (!product) throw new NotFoundError('Product not found', 'getProductByProductPublicId');
      await elasticSearch.addItemToIndex(ElasticsearchIndexes.products, `${product.productPublicId}`, product);
    }
    let store: IStoreDocument | null = await elasticSearch.getIndexedData(ElasticsearchIndexes.stores, product!.storePublicId);
    if (!store) {
      store = await grpcUserClient.getStoreByStorePublicId(product!.storePublicId);
    }
    return { product, store };
  };

  getStoreProducts = async (storePublicId: string): Promise<IProductDocument[]> => {
    const queryResults = await searchService.productsSearchByStoreId(storePublicId);
    const products: IProductDocument[] = [];
    for (const item of queryResults.hits) {
      products.push(item._source as IProductDocument);
    }
    return products;
  };

  updateProduct = async (productPublicId: string, payload: IProductDocument): Promise<IProductDocument> => {
    const document = await ProductModel.findOneAndUpdate(
      { productPublicId: productPublicId },
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
    ).exec();
    if (document) {
      const data = document.toJSON() as IProductDocument;
      await elasticSearch.updateIndexedItem(ElasticsearchIndexes.products, `${document.productPublicId}`, data);
    }
    return document as IProductDocument;
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
        storePublicId: `${store.storePublicId}`,
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
