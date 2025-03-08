import { ElasticSearch as BaseElasticSearch } from '@cngvc/shopi-shared';
import { config } from './config';

class ElasticSearch {
  client: BaseElasticSearch;
  constructor() {
    this.client = new BaseElasticSearch(`${config.ELASTIC_SEARCH_URL}`);
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
