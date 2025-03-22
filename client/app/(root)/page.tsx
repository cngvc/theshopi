import ProductList from '@/components/shared/product/product-list';
import { getProductList } from '@/lib/actions/product.action';

const Page = async () => {
  const products = await getProductList();

  return (
    <div>
      <ProductList data={products} />
    </div>
  );
};

export default Page;
