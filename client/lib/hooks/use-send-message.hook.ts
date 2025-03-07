import { IMessageDocument } from '@cngvc/shopi-shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendMessage } from '../actions/chat.action';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (payload: IMessageDocument) => {
      // await queryClient.cancelQueries({ queryKey: ['messages', payload.conversationId] });
      // const previousMessages = queryClient.getQueryData<IMessageDocument[]>(['messages', payload.conversationId]);
      // queryClient.setQueryData(['messages', payload.conversationId], (prevData: IMessageDocument[] = []) => [
      //   ...prevData,
      //   {
      //     _id: Date.now().toString(),
      //     body: payload.body,
      //     senderId: payload.senderId,
      //     createdAt: new Date().toISOString()
      //   } as IMessageDocument
      // ]);
      // return { previousMessages };
    },
    onError: (_error, payload, context) => {
      toast.error('Failed to send message');
      // if (context?.previousMessages) {
      //   queryClient.setQueryData(['messages', payload.conversationId], context.previousMessages);
      // }
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ['messages', payload.conversationId] });
    }
  });
};
