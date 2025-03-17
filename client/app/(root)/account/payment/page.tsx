'use client';

import Loading from '@/components/shared/loading';
import { useCurrentBuyer } from '@/lib/hooks/use-buyer.hook';
import { IPayment } from '@cngvc/shopi-types';
import PaymentMethodForm from './form';

const Page = () => {
  const { data, isLoading } = useCurrentBuyer();
  if (isLoading) {
    return <Loading />;
  }
  return <PaymentMethodForm payment={data?.payment as IPayment} />;
};

export default Page;
