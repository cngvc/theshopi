import { useQuery } from '@tanstack/react-query';
import { getConversationList } from '../actions/chat.action';

export const useConversations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversationList()
  });
  return { data, isLoading };
};
