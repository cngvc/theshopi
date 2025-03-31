'use client';

import Loading from '@/components/shared/loading';
import OrderItem from '@/components/shared/order-item';
import { useOrders } from '@/lib/hooks/use-orders.hook';
import { IOrderDocument } from '@cngvc/shopi-types';

const Page = () => {
  const { data: orders, isLoading: isFetchingOrders } = useOrders();

  if (isFetchingOrders) {
    return <Loading />;
  }

  if (!orders?.length) {
    return <div>No orders found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <OrderItem key={order.orderPublicId} order={order as IOrderDocument} />
        ))}
        <div />
      </div>
    </div>
  );
};

export default Page;
