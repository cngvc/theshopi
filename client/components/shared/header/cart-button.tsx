'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import pages from '@/lib/constants/pages';
import { useCart } from '@/lib/hooks/use-cart.hook';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const CartButton = () => {
  const { data } = useCart();

  const total = useMemo(() => {
    if (data) {
      return data.reduce((prev, cur) => prev + cur.quantity, 0);
    }
    return 0;
  }, [data]);

  return (
    <Button asChild variant={'ghost'}>
      <Link href={pages.cart}>
        {!!data?.length && <Badge className="rounded-full">{total < 10 ? total : '9+'}</Badge>}
        <ShoppingCartIcon />
      </Link>
    </Button>
  );
};

export default CartButton;
