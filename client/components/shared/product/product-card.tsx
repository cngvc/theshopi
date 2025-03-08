import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import pages from '@/lib/constants/pages';
import { IProductDocument } from '@cngvc/shopi-shared-types';
import Image from 'next/image';
import Link from 'next/link';
import ProductPrice from './product-price';

const ProductCard = ({ product }: { product: IProductDocument }) => {
  return (
    <Link href={`${pages.products}/${product.slug}-i.${product.productPublicId}`}>
      <Card className="col-span-1">
        <CardHeader>
          <Image
            src={'https://placehold.co/320x320/png'}
            width={320}
            height={320}
            priority={true}
            alt={product.name}
            className="object-cover"
          />
        </CardHeader>
        <CardContent>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <p className="">{product.ratingsCount} Stars</p>
          <ProductPrice value={product.price} />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
