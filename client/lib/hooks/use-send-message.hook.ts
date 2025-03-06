import { IMessageDocument } from '@cngvc/shopi-shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '../actions/chat.action';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (payload: IMessageDocument) => {
      await queryClient.cancelQueries({ queryKey: ['messages', payload.conversationId] });
      const previousMessages = queryClient.getQueryData<IMessageDocument[]>(['messages', payload.conversationId]);
      queryClient.setQueryData(['messages', payload.conversationId], (old: IMessageDocument[] = []) => [
        ...old,
        {
          _id: Date.now().toString(),
          body: payload.body,
          receiverUsername: payload.receiverUsername,
          senderUsername: payload.senderUsername,
          createdAt: new Date().toISOString()
        } as IMessageDocument
      ]);

      return { previousMessages };
    },
    onError: (_error, payload, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', payload.conversationId], context.previousMessages);
      }
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ['messages', payload.conversationId] });
    }
  });
};
