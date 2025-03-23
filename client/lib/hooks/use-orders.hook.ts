import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../actions/order.action';
import queryKeys from '../constants/query-keys';

export const useOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.orders],
    queryFn: getOrders,
    initialData: []
  });
  return { data, isLoading };
};
