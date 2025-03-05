import { Client } from '@elastic/elasticsearch';
import { config } from '@orders/config';
import { SERVICE_NAME } from '@orders/constants';
import { log, logCatch } from '@orders/utils/logger.util';

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public async checkConnection(): Promise<void> {
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
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
