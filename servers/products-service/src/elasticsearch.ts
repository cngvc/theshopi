import { getErrorMessage } from '@cngvc/shopi-shared';
import { Client } from '@elastic/elasticsearch';
import { config } from '@products/config';
import { SERVICE_NAME } from '@products/constants';
import { log } from '@products/utils/logger.util';

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

  async createIndex(indexName: string): Promise<void> {
    try {
      const result: boolean = await this.checkIfIndexExist(indexName);
      if (result) {
        log.info(`Index "${indexName}" already exist.`);
      } else {
        await this.elasticSearchClient.indices.create({ index: indexName });
        await this.elasticSearchClient.indices.refresh({ index: indexName });
        log.info(`Created index ${indexName}`);
      }
    } catch (error) {
      log.error(`An error occurred while creating the index ${indexName}`);
      log.log('error', SERVICE_NAME + ' createIndex() method:', getErrorMessage(error));
    }
  }

  addItemToIndex = async (index: string, itemId: string, productDocument: unknown): Promise<void> => {
    try {
      await this.elasticSearchClient.index({
        index,
        id: itemId,
        document: productDocument
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' addItemToIndex() method:', getErrorMessage(error));
    }
  };

  updateIndexedItem = async (index: string, itemId: string, productDocument: unknown): Promise<void> => {
    try {
      await this.elasticSearchClient.update({
        index,
        id: itemId,
        doc: productDocument
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' updateIndexedItem() method:', getErrorMessage(error));
    }
  };

  deleteIndexedItem = async (index: string, itemId: string): Promise<void> => {
    try {
      await this.elasticSearchClient.delete({
        index,
        id: itemId
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' deleteIndexedItem() method:', getErrorMessage(error));
    }
  };
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
