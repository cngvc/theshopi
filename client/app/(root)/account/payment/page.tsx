'use client';

import Loading from '@/components/shared/loading';
import { useCurrentBuyer } from '@/lib/hooks/use-buyer.hook';
import { IBuyerPayment } from '@cngvc/shopi-types';
import PaymentMethodForm from './form';

const Page = () => {
  const { data, isLoading } = useCurrentBuyer();
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }
  return <PaymentMethodForm payment={data?.payment as IBuyerPayment} />;
};

export default Page;
