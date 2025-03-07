import { NotFoundError } from '@cngvc/shopi-shared';
import { IProductDocument } from '@cngvc/shopi-shared-types';
import { Client } from '@elastic/elasticsearch';
import { CountResponse, QueryDslQueryContainer, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@products/config';
import { SERVICE_NAME } from '@products/constants';
import { log, logCatch } from '@products/utils/logger.util';

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
        logCatch(error, 'checkConnection, connection to elasticsearch failed, retrying');
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
      logCatch(error, 'getDocumentCount');
      return 0;
    }
  }

  async getIndexedData(index: string, identifier: string): Promise<IProductDocument> {
    try {
      const result = await this.elasticSearchClient.get({ index, id: identifier });
      return result?._source as IProductDocument;
    } catch (error) {
      logCatch(error, 'getIndexedData');
      throw new NotFoundError('Product not found', 'getIndexedData method');
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
      logCatch(error, 'createIndex');
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
      logCatch(error, 'addItemToIndex');
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
      logCatch(error, 'updateIndexedItem');
    }
  }

  async deleteIndexedItem(index: string, itemId: string): Promise<void> {
    try {
      await this.elasticSearchClient.delete({
        index,
        id: itemId
      });
    } catch (error) {
      logCatch(error, 'deleteIndexedItem');
    }
  }

  async search(index: string, queryList: QueryListType, params?: Omit<SearchRequest, 'index' | 'query'>) {
    return await this.elasticSearchClient.search({
      index,
      query: {
        bool: {
          must: queryList
        }
      },
      ...params
    });
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
