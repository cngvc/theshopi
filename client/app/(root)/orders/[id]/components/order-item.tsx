'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productUrl } from '@/lib/utils';
import { ICartItem } from '@cngvc/shopi-types';
import { ListCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const OrderItem = ({ items }: { items: ICartItem[] }) => {
  return (
    <Card className="md:col-span-3">
      <CardContent className=" gap-4">
        <CardTitle className="gap-2 flex items-center">
          <ListCheck className="w-6 h-6" /> <span>Order Items</span>
        </CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.productPublicId}>
                <TableCell>
                  <Link href={productUrl(item.slug!, item.productPublicId!)} className="flex items-center">
                    <Image src={item.thumb!} alt={item.name!} width={50} height={50} className="object-cover aspect-square" />
                    <span className="px-2">{item.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                <TableCell className="text-right text-sm">${item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
