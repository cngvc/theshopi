import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateBuyerPayment } from '../actions/buyer.action';

export const useUpdateBuyerPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBuyerPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.buyer] });
      toast.success('Updated your payment.', {
        description: 'Use payment has been updated'
      });
    },
    onError: () => {
      toast.error('Something was wrong');
    }
  });
};
