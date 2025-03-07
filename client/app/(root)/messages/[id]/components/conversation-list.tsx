'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversations } from '@/lib/hooks/use-conversations.hook';
import { useOnline } from '@/lib/hooks/use-online.hook';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import ConversationItem from './conversation-item';
import MessageSkeleton from './message-skeleton';

const ConversationList = () => {
  const session = useSession();
  const { data, isLoading } = useConversations();
  const { onlineUsers } = useOnline();

  const list = useMemo(() => {
    return data?.map((conversation) => {
      const name =
        session?.data?.user?.username === conversation.senderUsername
          ? `${conversation.receiverUsername}`
          : `${conversation.senderUsername}`;
      const isOnline = onlineUsers.includes(name);
      return <ConversationItem isOnline={isOnline} conversation={conversation} name={name} key={conversation.conversationId} />;
    });
  }, [session?.data?.user, onlineUsers, data]);

  if (!data?.length) {
    return (
      <Card className="flex-1 col-span-2">
        <div className="p-6 text-center mt-4">
          <h2 className="text-xl mb-2">No chats history</h2>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 md:col-span-3 lg:col-span-2">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex flex-col flex-1 space-x-1 max-h-[calc(100vh-268px)]">
          {isLoading && <MessageSkeleton />}
          {list}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
