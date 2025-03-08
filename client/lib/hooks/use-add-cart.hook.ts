import { addToCart } from '@/lib/actions/cart.action';
import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productPublicId: string) => addToCart(productPublicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.cart] });
    }
  });
};
