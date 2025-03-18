'use client';

import Loading from '@/components/shared/loading';
import { useCurrentBuyer } from '@/lib/hooks/use-buyer.hook';
import { useCart } from '@/lib/hooks/use-cart.hook';
import { useMemo } from 'react';
import Bill from './components/bill';
import OrderItems from './components/order-items';
import PaymentCard from './components/payment-card';
import ShippingCard from './components/shipping-card';

const Page = () => {
  const { data: buyer, isLoading: isFetchingCurrentBuyer } = useCurrentBuyer();
  const { data: items = [], isLoading: isFetchingCart } = useCart();

  const prices = useMemo(() => {
    const itemsPrice = items.reduce((a, c) => a + c.price! * c.quantity, 0);
    const taxPrice = 0;
    const shippingPrice = 0;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    return {
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    };
  }, [items]);

  if (isFetchingCurrentBuyer || isFetchingCart) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShippingCard shippingAddress={buyer?.shippingAddress} />
        <PaymentCard payment={buyer?.payment} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrderItems items={items} />
        <div className="col-span-1">
          <Bill
            disabled={!items.length}
            itemsPrice={prices.itemsPrice}
            taxPrice={prices.taxPrice}
            shippingPrice={prices.shippingPrice}
            totalPrice={prices.totalPrice}
          />
        </div>

        <div />
      </div>
    </div>
  );
};

export default Page;
