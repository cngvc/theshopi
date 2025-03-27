import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import { getProductByIdentifier } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import MoreLikeThis from './components/more-like-this';
import StockCard from './components/stock-card';
import StoreCard from './components/store-card';

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const match = slug.match(/-i\.(.+)$/);
  const productPublicId = match ? match[1] : null;
  if (!productPublicId) notFound();

  const data = await getProductByIdentifier(productPublicId);
  if (!data) notFound();

  const { product } = data;
  return (
    <>
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-5">
          <div className="col-span-1 sm:col-span-2">
            <ProductImages images={[data.product.thumb || 'https://placehold.co/1000x1000/png']} />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <div className="flex flex-col gap-4">
              <h1 className="h3-bold">{product.name}</h1>
              <p>{product.ratingsCount} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice value={Number(product.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2" />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-5 col-span-full lg:col-span-1">
            {<StoreCard storePublicId={product.storePublicId} />}
            <StockCard product={product} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="h3-bold mb-5">Customer Reviews</h2>
      </section>

      <section>
        <h2 className="h3-bold mb-5">More Like This</h2>
        <MoreLikeThis id={productPublicId} />
      </section>
    </>
  );
};

export default ProductDetailsPage;
