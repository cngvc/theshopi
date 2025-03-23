import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../actions/chat.action';
import queryKeys from '../constants/query-keys';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.messages, payload.conversationPublicId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.conversations] });
    }
  });
};
