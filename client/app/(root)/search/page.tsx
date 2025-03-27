import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import { getProductList } from '@/lib/actions/product.action';
import Link from 'next/link';

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
    min_price: 1,
    max_price: 50
  },
  {
    name: '$51 to $100',
    value: '51-100',
    min_price: 51,
    max_price: 100
  },
  {
    name: '$101 to $200',
    value: '101-200',
    min_price: 101,
    max_price: 200
  },
  {
    name: '$201 to $500',
    value: '201-500',
    min_price: 201,
    max_price: 500
  },
  {
    name: '$501 to $1000',
    value: '501-1000',
    min_price: 501,
    max_price: 1000
  }
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    min_price: string;
    max_price: string;
  }>;
}) {
  const { q = 'all', min_price = null, max_price = null } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';

  if (isQuerySet) {
    return {
      title: `
      Search: ${isQuerySet ? q : ''}
      ${min_price ? `: Min Price ${min_price}` : ''}
      ${max_price ? `: Max Price ${max_price}` : ''}
      `
    };
  } else {
    return {
      title: 'Search Products'
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    page?: string;
  }>;
}) => {
  const { q = 'all', min_price = null, max_price = null, page = '0' } = await props.searchParams;
  const getFilterUrl = ({ min_price = null, max_price = null }: { min_price: string | null; max_price: string | null }) => {
    const params = { q, min_price, max_price };
    return `/search?${new URLSearchParams(params as Record<string, string>).toString()}`;
  };

  const data = await getProductList({
    query: q,
    min_price,
    max_price,
    page: Number(page)
  });

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Price Links */}
        <div className="text-xl mb-2 mt-8">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link href={getFilterUrl({ max_price: null, min_price: null })}>Any</Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link href={getFilterUrl({ max_price: `${p.max_price}`, min_price: `${p.min_price}` })}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== 'all' && q !== '' && 'Query: ' + q}
            {(min_price || max_price) && ' Price: ' + min_price + ' - ' + max_price}
            &nbsp;
            {(q !== 'all' && q !== '') || min_price || max_price ? (
              <Button variant={'link'} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.length === 0 && <div>No products found</div>}
          {data.map((product) => (
            <ProductCard key={product.productPublicId} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
