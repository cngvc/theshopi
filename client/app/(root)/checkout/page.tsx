'use client';

import Loading from '@/components/shared/loading';
import { useCurrentBuyer } from '@/lib/hooks/use-buyer.hook';
import PaymentCard from './components/payment-card';
import ShippingCard from './components/shipping-card';

const Page = () => {
  const { data, isLoading } = useCurrentBuyer();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShippingCard shippingAddress={data?.shippingAddress} />
        <PaymentCard payment={data?.payment} />
      </div>
    </div>
  );
};

export default Page;
