import { ElasticSearch as BaseElasticSearch } from '@cngvc/shopi-shared';
import { config } from './config';

class ElasticSearch extends BaseElasticSearch {
  constructor() {
    super(`${config.ELASTIC_SEARCH_URL}`);
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
