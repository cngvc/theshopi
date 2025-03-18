'use client';

import CartSkeleton from '@/components/shared/cart-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import pages from '@/lib/constants/pages';
import { useCart } from '@/lib/hooks/use-cart.hook';
import { formatCurrency, productUrl } from '@/lib/utils';
import { ArrowRight, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import ItemQuantity from './item-quantity';

const CartTable = () => {
  const router = useRouter();
  const { data: items = [], isLoading } = useCart();
  const [isPending, startTransition] = useTransition();

  if (isLoading) {
    return (
      <div>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        <CartSkeleton />
      </div>
    );
  }

  if (!items?.length && !isLoading) {
    return (
      <div>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        <div>
          Cart is empty. <Link href={pages.home}>Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productPublicId}>
                  <TableCell>
                    <Link href={productUrl(item.slug!, item.productPublicId!)} className="flex items-center">
                      <Image src={item.thumb!} alt={item.name} width={50} height={50} className="object-cover aspect-square" />
                      <span className="px-2">{item.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="flex-center gap-2">
                    <ItemQuantity productPublicId={item.productPublicId} quantity={Number(item.quantity)} />
                  </TableCell>
                  <TableCell className="text-right">${item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <Card>
            <CardContent className="gap-4">
              <div className="pb-3 text-xl flex-1">
                Subtotal({items.reduce((a, c) => a + c.quantity, 0)}):{' '}
                <span className="font-bold">{formatCurrency(items.reduce((a, c) => a + c.price * c.quantity, 0))}</span>
              </div>
              <Button className="w-full" disabled={isPending} onClick={() => startTransition(() => router.push(pages.checkout))}>
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CartTable;
