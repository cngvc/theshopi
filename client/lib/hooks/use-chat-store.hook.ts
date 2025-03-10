import { chatWithStore } from '@/lib/actions/chat.action';
import pages from '@/lib/constants/pages';
import queryKeys from '@/lib/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useChatWithStore = () => {
  const router = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receiverAuthId: string) => chatWithStore({ receiverAuthId: receiverAuthId }),
    onError: (_error) => {
      toast.error('Something was wrong.');
    },
    onSuccess: (data) => {
      if (data?.conversationPublicId) {
        queryClient.invalidateQueries({ queryKey: [queryKeys.conversations] });
        return router.push(`${pages.messages}/${data?.conversationPublicId}`);
      }
      toast.error('Cannot found conversation id');
    }
  });
};
