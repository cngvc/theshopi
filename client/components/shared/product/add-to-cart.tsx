'use client';

import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/lib/hooks/use-add-cart.hook';
import { useCart } from '@/lib/hooks/use-cart.hook';
import { IProductDocument } from '@cngvc/shopi-types';
import { Loader, Plus } from 'lucide-react';
import { useMemo } from 'react';

const AddToCart = ({ item }: { item: IProductDocument }) => {
  const { data } = useCart();
  const { mutateAsync: addToCart, isPending } = useAddToCart();

  const existItems = useMemo(() => {
    return data?.find((ci) => ci.productPublicId === item.productPublicId)?.quantity || 0;
  }, [data, item]);

  const handleAddToCart = async () => {
    addToCart(`${item.productPublicId}`);
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
