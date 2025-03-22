'use client';

import { Button } from '@/components/ui/button';
import { useCreateOrder } from '@/lib/hooks/use-create-order.hook';
import { Check, Loader } from 'lucide-react';

const PlaceOrderForm = ({ disabled }: { disabled: boolean }) => {
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createOrder();
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button disabled={isPending || disabled} className="w-full" type="submit">
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Place Order
      </Button>
    </form>
  );
};

export default PlaceOrderForm;
