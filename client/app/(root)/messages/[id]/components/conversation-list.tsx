'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/hooks/use-auth-id.hook';
import { useConversations } from '@/lib/hooks/use-conversations.hook';
import { useOnline } from '@/lib/hooks/use-online.hook';
import { useMemo } from 'react';
import ConversationItem from './conversation-item';
import MessageSkeleton from './message-skeleton';

const renderEmptyState = () => (
  <Card className="flex-1">
    <div className="p-6 text-center mt-4">
      <h2 className="text-xl mb-2">No chats history</h2>
    </div>
  </Card>
);

const renderLoadingState = () => (
  <ScrollArea className="flex flex-col flex-1 space-x-1 max-h-[calc(100vh-268px)]">
    <MessageSkeleton />
  </ScrollArea>
);

const ConversationList = () => {
  const { id } = useAuth();
  const { data: conversations, isLoading } = useConversations();
  const { onlineUsers } = useOnline();

  const renderConversations = useMemo(() => {
    if (!conversations?.length) return null;
    return conversations.map((conversation) => {
      const partner = conversation.participants.find((e) => e.authId !== id);
      const isOnline = onlineUsers.includes(`${partner?.authId}`);
      return <ConversationItem isOnline={isOnline} conversation={conversation} key={conversation.conversationPublicId} />;
    });
  }, [id, conversations, onlineUsers]);

  return (
    <Card className="flex-1 py-4">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex flex-col flex-1 space-x-1 max-h-[calc(100vh-268px)]">
          {isLoading && renderLoadingState()}
          {!isLoading && !conversations?.length && renderEmptyState()}
          {renderConversations}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
