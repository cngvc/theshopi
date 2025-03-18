import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { productUrl } from '@/lib/utils';
import { IProductDocument } from '@cngvc/shopi-types';
import Image from 'next/image';
import Link from 'next/link';
import ProductPrice from './product-price';

const ProductCard = ({ product }: { product: IProductDocument }) => {
  return (
    <Link href={productUrl(product.slug!, product.productPublicId!)} className="col-span-1 flex flex-col">
      <Card className="flex-1 pt-0 overflow-hidden">
        <CardHeader className="!p-0">
          <Image
            src={product.thumb || 'https://placehold.co/320x320/png'}
            width={320}
            height={320}
            priority={true}
            alt={product.name}
            className="object-cover aspect-square flex-1"
          />
        </CardHeader>
        <CardContent className="flex-1">
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
