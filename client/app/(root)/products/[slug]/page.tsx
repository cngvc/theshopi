import AddToCart from '@/components/shared/product/add-to-cart';
import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductByIdentifier } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const match = slug.match(/-i\.(.+)$/);
  const productId = match ? match[1] : null;
  if (!productId) notFound();
  const product = await getProductByIdentifier(productId);
  if (!product) notFound();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages
              images={[
                'https://placehold.co/1000x1000/png',
                'https://placehold.co/1000x1000/png',
                'https://placehold.co/1000x1000/png',
                'https://placehold.co/1000x1000/png'
              ]}
            />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
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

          <div>
            <Card>
              <CardContent>
                <div className="mb-2 flex justify-between items-center">
                  <div className="text-sm">Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-sm">Status</div>
                  {product.quantity! > 0 ? <Badge variant="outline">In Stock</Badge> : <Badge variant="destructive">Out Of Stock</Badge>}
                </div>

                {product.quantity! > 0 && <AddToCart item={product} />}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-5">Customer Reviews</h2>
      </section>
    </>
  );
};

export default ProductDetailsPage;
