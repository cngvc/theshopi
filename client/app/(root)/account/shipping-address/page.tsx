'use client';

import Loading from '@/components/shared/loading';
import { useCurrentBuyer } from '@/lib/hooks/use-buyer.hook';
import { IShippingAddress } from '@cngvc/shopi-types';
import ShippingAddressForm from './form';

const Page = () => {
  const { data, isLoading } = useCurrentBuyer();
  if (isLoading) {
    return <Loading />;
  }
  return <ShippingAddressForm address={data?.shippingAddress as IShippingAddress} />;
};

export default Page;
