import { getErrorMessage, IProductDocument, NotFoundError } from '@cngvc/shopi-shared';
import { Client } from '@elastic/elasticsearch';
import { CountResponse, GetResponse, QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@products/config';
import { SERVICE_NAME } from '@products/constants';
import { log } from '@products/utils/logger.util';

type QueryListType = QueryDslQueryContainer | QueryDslQueryContainer[];

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      try {
        const health = await this.elasticSearchClient.cluster.health({});
        log.info(SERVICE_NAME + ` elasticsearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error(SERVICE_NAME + ' connection to elasticsearch failed, retrying');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        log.log('error', SERVICE_NAME + ' checkConnection() method:', getErrorMessage(error));
      }
    }
  }

  private async checkIfIndexExist(indexName: string): Promise<boolean> {
    const result: boolean = await this.elasticSearchClient.indices.exists({ index: indexName });
    return result;
  }

  async getDocumentCount(index: string): Promise<number> {
    try {
      const result: CountResponse = await this.elasticSearchClient.count({ index });
      return result.count;
    } catch (error) {
      log.log('error', SERVICE_NAME + ' getDocumentCount() method error:', getErrorMessage(error));
      return 0;
    }
  }

  async getIndexedData(index: string, itemId: string): Promise<IProductDocument> {
    try {
      const result: GetResponse = await this.elasticSearchClient.get({ index, id: itemId });
      return result._source as IProductDocument;
    } catch (error) {
      log.log('error', SERVICE_NAME + ' getIndexedData() method error:', getErrorMessage(error));
      throw new NotFoundError('Product not found', 'getIndexedData() method');
    }
  }

  async createIndex(indexName: string): Promise<void> {
    try {
      const result: boolean = await this.checkIfIndexExist(indexName);
      if (result) {
        log.info(`Index "${indexName}" already existed.`);
      } else {
        await this.elasticSearchClient.indices.create({ index: indexName });
        await this.elasticSearchClient.indices.refresh({ index: indexName });
        log.info(`Created index ${indexName}.`);
      }
    } catch (error) {
      log.error(`An error occurred while creating the index ${indexName}`);
      log.log('error', SERVICE_NAME + ' createIndex() method:', getErrorMessage(error));
    }
  }

  async addItemToIndex(index: string, itemId: string, doc: unknown): Promise<void> {
    try {
      log.info(`Adding new doc named ${(doc as IProductDocument).name ?? 'Product'} to index ${index}`);
      await this.elasticSearchClient.index({
        index,
        id: itemId,
        document: doc
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' addItemToIndex() method:', getErrorMessage(error));
    }
  }

  async updateIndexedItem(index: string, itemId: string, doc: unknown) {
    try {
      await this.elasticSearchClient.update({
        index,
        id: itemId,
        doc: doc
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' updateIndexedItem() method:', getErrorMessage(error));
    }
  }

  async deleteIndexedItem(index: string, itemId: string): Promise<void> {
    try {
      await this.elasticSearchClient.delete({
        index,
        id: itemId
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' deleteIndexedItem() method:', getErrorMessage(error));
    }
  }

  async search(index: string, queryList: QueryListType) {
    return await this.elasticSearchClient.search({
      index,
      query: {
        bool: {
          must: queryList
        }
      }
    });
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
