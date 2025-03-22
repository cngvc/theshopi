'use client';

import ProductList from '@/components/shared/product/product-list';
import { useProducts } from '@/lib/hooks/use-products.hook';

const Page = () => {
  const { data } = useProducts();
  return (
    <div>
      <ProductList data={data || []} />
    </div>
  );
};

export default Page;
