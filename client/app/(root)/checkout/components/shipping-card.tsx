import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pages from '@/lib/constants/pages';
import { IShippingAddress } from '@cngvc/shopi-types';
import { ArrowRight, MapPinHouse } from 'lucide-react';
import Link from 'next/link';

const ShippingCard = ({ shippingAddress }: { shippingAddress?: IShippingAddress }) => {
  return (
    <Card className="flex-1">
      <CardHeader className="space-y-2">
        <CardTitle className="gap-2 flex items-center">
          <MapPinHouse className="w-6 h-6" /> <span>Delivery Address</span>
        </CardTitle>
        <CardContent className="gap-4 px-0 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-1 w-full items-center">
            {shippingAddress
              ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country} - ${shippingAddress.postalCode}`
              : 'N/A'}
          </div>
          <Button className="w-full md:w-auto" asChild>
            <Link href={pages.account_shipping_address}>
              <ArrowRight className="w-4 h-4" /> Change
            </Link>
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default ShippingCard;
