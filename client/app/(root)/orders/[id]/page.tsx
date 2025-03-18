'use client';

import Loading from '@/components/shared/loading';
import { useParamId } from '@/lib/hooks/use-id.hook';
import { useOrder } from '@/lib/hooks/use-order.hook';
import { ICartItem } from '@cngvc/shopi-types';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';
import Bill from './components/bill';
import OrderItems from './components/order-items';
import PaymentAction from './components/payment-action';
import PaymentCard from './components/payment-card';
import ShippingCard from './components/shipping-card';

const Page = () => {
  const id = useParamId();
  if (!id) notFound();
  const { data: order, isLoading: isFetchingOrder } = useOrder(id);

  const prices = useMemo(() => {
    const itemsPrice = order?.items?.reduce((a, c) => a + c.price! * c.quantity, 0) || 0;
    const taxPrice = 0;
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    return {
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    };
  }, [order]);

  if (isFetchingOrder) {
    return <Loading />;
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShippingCard shippingAddress={order.shipping} isPaid={!!order.isPaid} paidAt={order.paidAt as string | null} />
        <PaymentCard payment={order?.payment} isDelivered={!!order.isDelivered} deliveredAt={order.deliveredAt as string | null} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrderItems items={order!.items as ICartItem[]} />
        <div className="col-span-1">
          <Bill
            itemsPrice={prices.itemsPrice}
            taxPrice={prices.taxPrice}
            shippingPrice={prices.shippingPrice}
            totalPrice={prices.totalPrice}
          >
            <PaymentAction isPaid={!!order.isPaid} isDelivered={!!order.isDelivered} payment={order.payment} />
          </Bill>
        </div>
        <div />
      </div>
    </div>
  );
};

export default Page;
