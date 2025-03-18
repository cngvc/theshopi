import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { IShippingAddress } from '@cngvc/shopi-types';
import { MapPinHouse } from 'lucide-react';

const ShippingCard = ({
  shippingAddress,
  isPaid = false,
  paidAt = null
}: {
  shippingAddress?: IShippingAddress;
  isPaid: boolean;
  paidAt: string | null;
}) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex-1">
        <CardTitle className="gap-2 flex items-center flex-1">
          <MapPinHouse className="w-6 h-6" /> <span>Delivery Address</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="gap-4 flex flex-col md:flex-row justify-between items-end">
        <div className="flex flex-1 w-full items-center">
          {shippingAddress
            ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country} - ${shippingAddress.postalCode}`
            : 'N/A'}
        </div>
        {isPaid && paidAt ? (
          <Badge variant="secondary">Paid at {formatDate(paidAt)}</Badge>
        ) : (
          <Badge variant={'destructive'}>Not Paid</Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingCard;
