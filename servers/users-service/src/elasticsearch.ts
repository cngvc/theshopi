import { IAuthDocument } from '@cngvc/shopi-shared';
import { Client } from '@elastic/elasticsearch';
import { config } from '@users/config';
import { SERVICE_NAME } from '@users/constants';
import { log, logCatch } from '@users/utils/logger.util';

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

  async addItemToIndex(index: string, itemId: string, doc: unknown): Promise<void> {
    try {
      log.info(`Adding new doc named ${(doc as IAuthDocument).username ?? 'Buyer'} to index ${index}`);
      await this.elasticSearchClient.index({
        index,
        id: itemId,
        document: doc
      });
    } catch (error) {
      logCatch(error, 'addItemToIndex');
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
