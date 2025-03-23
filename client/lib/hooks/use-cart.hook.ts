import { useQuery } from '@tanstack/react-query';
import { getCart } from '../actions/cart.action';
import queryKeys from '../constants/query-keys';

export const useCart = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.cart],
    queryFn: getCart,
    initialData: []
  });
  return { data, isLoading };
};
