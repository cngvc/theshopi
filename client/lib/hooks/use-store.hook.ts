import { useQuery } from '@tanstack/react-query';
import { getStoreByStorePublicId } from '../actions/store.action';
import queryKeys from '../constants/query-keys';

export const useStore = (id?: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.store, id],
    queryFn: () => getStoreByStorePublicId(id!),
    enabled: !!id
  });
  return { data, isLoading };
};
