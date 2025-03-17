import { useQuery } from '@tanstack/react-query';
import { getCurrentBuyer } from '../actions/buyer.action';
import queryKeys from '../constants/query-keys';

export const useCurrentBuyer = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.buyer],
    queryFn: getCurrentBuyer
  });
  return { data, isLoading };
};
