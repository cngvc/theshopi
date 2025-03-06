import { useQuery } from '@tanstack/react-query';
import { getConversationMessages } from '../actions/chat.action';

export const useMessages = (id?: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => getConversationMessages(id!),
    enabled: !!id
  });
  return { data, isLoading };
};
