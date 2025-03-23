import { addToCart } from '@/lib/actions/cart.action';
import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import pages from '../constants/pages';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productPublicId: string) => addToCart(productPublicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.cart] });
      toast.success('Update your cart', {
        description: 'The product has been added to the cart',
        action: {
          label: 'Go to cart',
          onClick: () => redirect(pages.cart)
        }
      });
    }
  });
};
