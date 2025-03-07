import { useQuery } from '@tanstack/react-query';
import { getCart } from '../actions/cart.action';

export const useCart = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart
  });
  return { data, isLoading };
};
