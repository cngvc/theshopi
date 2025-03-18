import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { IPayment } from '@cngvc/shopi-types';
import { MapPinHouse } from 'lucide-react';

const PaymentCard = ({
  payment,
  isDelivered = false,
  deliveredAt = null
}: {
  payment?: IPayment;
  isDelivered: boolean;
  deliveredAt: string | null;
}) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex-1">
        <CardTitle className="gap-2 flex items-center">
          <MapPinHouse className="w-6 h-6" /> <span>Payment</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="gap-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-1 w-full justify-start items-center capitalize">Method: {payment ? `${payment.method}` : 'N/A'}</div>
        {isDelivered && deliveredAt ? (
          <Badge variant="secondary">Delivered at {formatDate(deliveredAt!)}</Badge>
        ) : (
          <Badge variant="destructive">Not Delivered</Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
