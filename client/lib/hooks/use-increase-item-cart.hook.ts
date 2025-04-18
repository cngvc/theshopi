import { increaseItemInCart } from '@/lib/actions/cart.action';
import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useIncreaseItemCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productPublicId: string) => increaseItemInCart(productPublicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.cart] });
      toast.success('The product in cart has been updated');
    }
  });
};
