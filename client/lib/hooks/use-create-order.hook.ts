import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createOrder } from '../actions/order.action';
import pages from '../constants/pages';

export const useCreateOrder = () => {
  const router = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.cart] });
      toast.success('The order has been created');
      if (data?.orderPublicId) {
        router.push(`${pages.orders}/${data?.orderPublicId}`);
      }
    }
  });
};
