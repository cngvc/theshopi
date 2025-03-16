import AddToCart from '@/components/shared/product/add-to-cart';
import ProductPrice from '@/components/shared/product/product-price';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { IProductDocument } from '@cngvc/shopi-types';

const StockCard = ({ product }: { product: IProductDocument }) => {
  return (
    <Card>
      <CardContent>
        <div className="mb-2 flex justify-between items-center gap-2">
          <div className="text-sm">Price</div>
          <ProductPrice value={Number(product.price)} />
        </div>

        <div className="mb-4 flex justify-between items-center gap-2">
          <div className="text-sm">Status</div>
          {Number(product.quantity) > 0 ? <Badge variant="outline">In Stock</Badge> : <Badge variant="destructive">Out Of Stock</Badge>}
        </div>

        {Number(product.quantity) > 0 && <AddToCart item={product} />}
      </CardContent>
    </Card>
  );
};

export default StockCard;
