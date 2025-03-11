'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDecreaseItemCart } from '@/lib/hooks/use-decrease-item-cart.hook';
import { useIncreaseItemCart } from '@/lib/hooks/use-increase-item-cart.hook';
import { useUpdateCartItem } from '@/lib/hooks/use-update-cart-item.hook';
import { Loader, Minus, Plus } from 'lucide-react';

const ItemQuantity = ({ quantity, productPublicId }: { quantity: number; productPublicId: string }) => {
  const { mutate: increaseCartItem, isPending: isIncreaseCartPending } = useIncreaseItemCart();
  const { mutate: decreaseCartItem, isPending: isDecreaseCartPending } = useDecreaseItemCart();
  const { mutate: updateCartItem } = useUpdateCartItem();

  return (
    <div className="flex-center gap-2">
      <Button
        disabled={isDecreaseCartPending}
        variant="outline"
        type="button"
        onClick={() => {
          decreaseCartItem(productPublicId);
        }}
      >
        {isDecreaseCartPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
      </Button>
      <span>
        <Input
          value={quantity}
          className="w-20 text-right"
          min={1}
          type="number"
          onChange={({ target }) => {
            if (Number(target.value) !== quantity) {
              updateCartItem({ productPublicId, quantity: Number(target.value) });
            }
          }}
        />
      </span>

      <Button
        disabled={isIncreaseCartPending}
        variant="outline"
        type="button"
        onClick={() => {
          increaseCartItem(productPublicId);
        }}
      >
        {isIncreaseCartPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default ItemQuantity;
