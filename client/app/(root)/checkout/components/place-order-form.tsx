'use client';

import { Button } from '@/components/ui/button';
import pages from '@/lib/constants/pages';
import { useCreateOrder } from '@/lib/hooks/use-create-order.hook';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PlaceOrderForm = ({ disabled }: { disabled: boolean }) => {
  const router = useRouter();

  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await createOrder();
    if (result?.orderPublicId) {
      router.replace(`${pages.orders}/${result.orderPublicId}`);
    }
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
