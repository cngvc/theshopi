import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../actions/cart.action';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};
