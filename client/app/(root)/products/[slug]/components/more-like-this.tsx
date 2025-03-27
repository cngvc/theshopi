import ProductCard from '@/components/shared/product/product-card';
import { getMoreProductsLikeThis } from '@/lib/actions/product.action';

const MoreLikeThis = async ({ id }: { id: string }) => {
  const data = await getMoreProductsLikeThis(id);

  if (!data?.length) return <div>Nothing to show</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {data?.map((product) => <ProductCard key={`${product.productPublicId}`} product={product} />)}
    </div>
  );
};

export default MoreLikeThis;
