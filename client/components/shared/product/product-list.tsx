import { IProductDocument } from '@cngvc/shopi-types';
import ProductCard from './product-card';

const ProductList = ({ data }: { data: IProductDocument[] }) => {
  if (!data?.length) {
    return (
      <div className="">
        <p className="text-2xl">Unfortunately, no products found</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.map((product) => <ProductCard key={`${product.productPublicId}`} product={product} />)}
    </div>
  );
};

export default ProductList;
