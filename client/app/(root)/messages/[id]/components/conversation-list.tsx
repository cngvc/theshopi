'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversations } from '@/lib/hooks/use-conversations.hook';
import { useSession } from 'next-auth/react';
import ConversationItem from './conversation-item';
import MessageSkeleton from './message-skeleton';

const ConversationList = () => {
  const session = useSession();
  const { data, isLoading } = useConversations();
  return (
    <Card className="flex-1 col-span-2">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex flex-col flex-1 space-x-1 max-h-[calc(100vh-268px)]">
          {isLoading && <MessageSkeleton />}
          {data?.map((conversation) => (
            <ConversationItem conversation={conversation} currentUser={session?.data?.user?.username} key={conversation.conversationId} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
