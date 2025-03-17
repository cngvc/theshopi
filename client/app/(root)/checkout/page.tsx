'use client';

import Loading from '@/components/shared/loading';
import { useCurrentBuyer } from '@/lib/hooks/use-buyer.hook';
import ShippingCard from './components/shipping-card';

const Page = () => {
  const { data, isLoading } = useCurrentBuyer();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col space-y-4">
      <ShippingCard shippingAddress={data?.shippingAddress} />
    </div>
  );
};

export default Page;
