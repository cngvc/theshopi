'use client';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversation } from '@/lib/hooks/use-conversation.hook';
import { useParamId } from '@/lib/hooks/use-id.hook';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

const MessageBoxHeader = () => {
  const id = useParamId();
  const session = useSession();
  const { data, isLoading } = useConversation(id);

  const name = useMemo(() => {
    if (!data) return 'Username';
    return session?.data?.user?.username === data?.receiverUsername ? `${data.senderUsername}` : `${data.receiverUsername}`;
  }, [data, session]);

  return (
    <CardHeader>
      <CardTitle>{isLoading ? <Skeleton className="h-4 w-2/5" /> : name}</CardTitle>
    </CardHeader>
  );
};

export default MessageBoxHeader;
