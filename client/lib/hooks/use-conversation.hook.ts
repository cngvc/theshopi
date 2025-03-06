import { useQuery } from '@tanstack/react-query';
import { getConversationByConversationId } from '../actions/chat.action';

export const useConversation = (id?: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversationByConversationId(id!),
    enabled: !!id
  });
  return { data, isLoading };
};
