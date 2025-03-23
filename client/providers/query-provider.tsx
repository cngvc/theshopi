'use client';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      if (error.message !== 'NEXT_REDIRECT') {
        toast.error(error.message);
      }
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error.message !== 'NEXT_REDIRECT') {
        toast.error(error.message);
      }
    }
  })
});
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
