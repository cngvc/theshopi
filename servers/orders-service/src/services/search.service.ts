import { ElasticsearchIndexes, IBuyerDocument } from '@cngvc/shopi-shared-types';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { elasticSearch } from '@order/elasticsearch';

class SearchService {
  async searchBuyerByAuthId(authId: string) {
    const queryList = [{ term: { 'authId.keyword': authId } }];
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.auth, queryList, { size: 1 });
    if (hits.hits.length === 0) {
      return null;
    }
    return hits.hits[0]._source as IBuyerDocument;
  }
}

export const searchService = new SearchService();
