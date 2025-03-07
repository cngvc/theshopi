'use client';

import { Button } from '@/components/ui/button';
import { IProductDocument } from '@cngvc/shopi-shared-types';
import { Loader, Plus } from 'lucide-react';
import { useTransition } from 'react';

const AddToCart = ({ item }: { item: IProductDocument }) => {
  const [isPending, startTransition] = useTransition();
  const handleAddToCart = async () => {};

  const handleRemoveFromCart = async () => {};

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add To Cart
    </Button>
  );
};

export default AddToCart;
