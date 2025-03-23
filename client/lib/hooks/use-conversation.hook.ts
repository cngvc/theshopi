import { useQuery } from '@tanstack/react-query';
import { getConversationByConversationPublicId } from '../actions/chat.action';
import queryKeys from '../constants/query-keys';

export const useConversation = (id?: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.conversation, id],
    queryFn: () => getConversationByConversationPublicId(id!),
    enabled: !!id,
    initialData: null
  });
  return { data, isLoading };
};
