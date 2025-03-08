'use client';

import { Button } from '@/components/ui/button';
import pages from '@/lib/constants/pages';
import { useAddToCart } from '@/lib/hooks/use-add-cart.hook';
import { useCart } from '@/lib/hooks/use-cart.hook';
import { IProductDocument } from '@cngvc/shopi-shared-types';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

const AddToCart = ({ item }: { item: IProductDocument }) => {
  const router = useRouter();
  const { data } = useCart();
  const { mutate: addToCart, isPending } = useAddToCart();

  const existItems = useMemo(() => {
    return data?.find((ci) => ci.productPublicId === item.productPublicId)?.quantity || 0;
  }, [data, item]);

  const handleAddToCart = async () => {
    try {
      await addToCart(`${item.productPublicId}`);
      toast.success('Update your cart', {
        description: 'The product has been added to the cart',
        action: {
          label: 'Go to cart',
          onClick: () => router.push(pages.cart)
        }
      });
    } catch (error: unknown) {
      console.log(error);
      toast.error('Something was wrong');
    }
  };

  return (
    <div className="space-y-2">
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add To Cart
      </Button>
      {!!existItems && (
        <p className="text-sm text-right">
          <strong>{existItems}</strong> products in the cart
        </p>
      )}
    </div>
  );
};

export default AddToCart;
