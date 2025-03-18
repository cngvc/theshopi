import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from './place-order-form';

const Bill = ({
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  disabled
}: {
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  disabled: boolean;
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div>Items</div>
          <div>{formatCurrency(itemsPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Tax</div>
          <div>{formatCurrency(taxPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Shipping</div>
          <div>{formatCurrency(shippingPrice)}</div>
        </div>
        <div className="flex justify-between">
          <div>Total</div>
          <div>{formatCurrency(totalPrice)}</div>
        </div>
        <PlaceOrderForm disabled={disabled} />
      </CardContent>
    </Card>
  );
};

export default Bill;
