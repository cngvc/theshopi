import { useQuery } from '@tanstack/react-query';
import { getOrderByOrderPublicId } from '../actions/order.action';
import queryKeys from '../constants/query-keys';

export const useOrder = (id?: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.order, id],
    queryFn: () => getOrderByOrderPublicId(id!),
    initialData: null
  });
  return { data, isLoading };
};
