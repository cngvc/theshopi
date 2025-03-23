import { useQuery } from '@tanstack/react-query';
import { getConversationList } from '../actions/chat.action';
import queryKeys from '../constants/query-keys';

export const useConversations = () => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.conversations],
    queryFn: () => getConversationList(),
    initialData: []
  });
  return { data, isLoading };
};
