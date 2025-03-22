'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductList } from '../actions/product.action';
import queryKeys from '../constants/query-keys';

export const useProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.products],
    queryFn: getProductList
  });
  return { data, isLoading };
};
