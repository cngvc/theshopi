import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateBuyerShippingAddress } from '../actions/buyer.action';

export const useUpdateBuyerShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBuyerShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.buyer] });
      toast.success('Updated your shipping address.', {
        description: 'Use shipping address has been updated'
      });
    }
  });
};
