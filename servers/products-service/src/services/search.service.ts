import { IHitsTotal, IPaginateProps, IQueryList } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes, IStoreDocument } from '@cngvc/shopi-shared-types';
import { SearchResponse, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { elasticSearch } from '@product/elasticsearch';

class SearchService {
  async searchProductsByStorePublicId(storePublicId: string) {
    const queryList = [{ term: { 'storePublicId.keyword': storePublicId } }];
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.products, queryList);
    const total = hits.total as SearchTotalHits;
    return {
      total: total.value,
      hits: hits.hits
    };
  }

  async searchProducts(searchQuery: string, paginate: IPaginateProps, min?: number, max?: number) {
    const { from = 0, size = 10 } = paginate;
    const queryList: IQueryList[] = [
      {
        query_string: {
          fields: ['name', 'description', 'description', 'tags', 'categories'],
          query: `*${searchQuery}*`
        }
      },
      {
        term: {
          isPublished: true
        }
      }
    ];
    if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
      queryList.push({
        range: {
          price: {
            gte: min,
            lte: max
          }
        }
      });
    }
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.products, queryList, {
      size,
      ...(from != 0 && { search_after: [from] })
    });
    const total: IHitsTotal = hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: hits.hits
    };
  }

  async searchStoreByAuthId(authId: string) {
    const queryList = [{ term: { 'ownerAuthId.keyword': authId } }];
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.stores, queryList, { size: 1 });
    if (hits.hits.length === 0) {
      return null;
    }
    return hits.hits[0]._source as IStoreDocument;
  }
}

export const searchService = new SearchService();
