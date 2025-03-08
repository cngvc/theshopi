import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendMessage } from '../actions/chat.action';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onError: (_error, payload, context) => {
      toast.error('Failed to send message');
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ['messages', payload.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });
};
