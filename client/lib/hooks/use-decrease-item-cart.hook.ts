import { decreaseItemInCart } from '@/lib/actions/cart.action';
import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDecreaseItemCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productPublicId: string) => decreaseItemInCart(productPublicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.cart] });
      toast.success('The product in cart has been updated');
    },
    onError: () => {
      toast.error('Something was wrong');
    }
  });
};
