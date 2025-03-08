import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendMessage } from '../actions/chat.action';
import queryKeys from '../constants/query-keys';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onError: (_error) => {
      toast.error('Failed to send message, try again later.');
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.messages, payload.conversationPublicId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.conversations] });
    }
  });
};
