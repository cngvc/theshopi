import { updateCart } from '@/lib/actions/cart.action';
import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productPublicId, quantity }: { productPublicId: string; quantity: number }) => updateCart(productPublicId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.cart] });
      toast.success('The product in cart has been updated');
    }
  });
};
