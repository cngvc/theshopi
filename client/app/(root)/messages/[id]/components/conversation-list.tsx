'use server';

import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getConversationList } from '@/lib/actions/chat.action';
import { IMessageDocument } from '@cngvc/shopi-shared-types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ConversationItem from './conversation-item';

const ConversationList = async () => {
  const session = await auth();
  if (!session?.user?.username) throw new Error('User not found');
  const conversations = await getConversationList();

  const name = (conversation: IMessageDocument): string => {
    return session?.user?.username === conversation.senderUsername ? `${conversation.receiverUsername}` : `${conversation.senderUsername}`;
  };

  return (
    <Card className="flex-1 col-span-2">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex flex-col flex-1 space-x-1 max-h-[calc(100vh-268px)]">
          {conversations.map((conversation) => (
            <ConversationItem conversation={conversation} user={name(conversation)} key={conversation.conversationId} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
