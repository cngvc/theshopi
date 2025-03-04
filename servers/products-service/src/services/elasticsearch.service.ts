import { SearchResponse, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { elasticSearchIndexes } from '@products/constants/elasticsearch-indexes';
import { elasticSearch } from '@products/elasticsearch';

class ElasticsearchService {
  async productsSearchByStoreId(searchQuery: string) {
    const queryList = [
      {
        query_string: {
          fields: ['storeId'],
          query: `${searchQuery}`
        }
      }
    ];
    const { hits }: SearchResponse = await elasticSearch.search(elasticSearchIndexes.products, queryList);
    const total = hits.total as SearchTotalHits;
    return {
      total: total.value,
      hits: hits.hits
    };
  }

  async productsSearch() {}
}
export const elasticsearchService = new ElasticsearchService();
