import { IHitsTotal, IPaginateProps, IQueryList, ISearchResult } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes, IStoreDocument } from '@cngvc/shopi-types';
import { SearchResponse, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { elasticSearch } from '@product/elasticsearch';

class SearchService {
  async searchProductsByStorePublicId(storePublicId: string) {
    const queryList = [{ term: { 'storePublicId.keyword': storePublicId } }];
    const { hits }: SearchResponse = await elasticSearch.search(ElasticsearchIndexes.products, {
      bool: {
        must: queryList
      }
    });
    const total = hits.total as SearchTotalHits;
    return {
      total: total.value,
      hits: hits.hits
    };
  }

  async searchProducts(searchQuery: string, paginate: IPaginateProps, min?: number, max?: number): Promise<ISearchResult> {
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
    const { hits }: SearchResponse = await elasticSearch.search(
      ElasticsearchIndexes.products,
      {
        bool: {
          must: queryList
        }
      },
      {
        size,
        ...(from != 0 && { search_after: [from] })
      }
    );
    const total: IHitsTotal = hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: hits.hits
    };
  }

  async searchStoreByAuthId(authId: string) {
    const queryList = [{ term: { 'ownerAuthId.keyword': authId } }];
    const { hits }: SearchResponse = await elasticSearch.search(
      ElasticsearchIndexes.stores,
      {
        bool: {
          must: queryList
        }
      },
      { size: 1 }
    );
    if (hits.hits.length === 0) {
      return null;
    }
    return hits.hits[0]._source as IStoreDocument;
  }

  searchMoreProductsLikeThis = async (productPubicId: string): Promise<ISearchResult> => {
    const result: SearchResponse = await elasticSearch.search(
      ElasticsearchIndexes.products,
      {
        more_like_this: {
          fields: ['name', 'description', 'tags', 'categories'],
          like: [
            {
              _index: ElasticsearchIndexes.products,
              _id: productPubicId
            }
          ],
          min_term_freq: 1,
          min_doc_freq: 1
        }
      },
      {
        size: 5
      }
    );
    const total: IHitsTotal = result.hits.total as IHitsTotal;
    return {
      total: total.value,
      hits: result.hits.hits
    };
  };
}

export const searchService = new SearchService();
