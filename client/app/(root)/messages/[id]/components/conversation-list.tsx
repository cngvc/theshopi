'use server';

import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getConversationList } from '@/lib/actions/chat.action';
import pages from '@/lib/constants/pages';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Link from 'next/link';

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
            <Link className="py-2 border-b" href={`${pages.messages}/${conversation?.conversationId}`} key={conversation.conversationId}>
              <p className="font-medium">{name(conversation)}</p>
              <div className="flex justify-between items-center">
                <p className="flex-1 truncate text-sm text-gray-500">{conversation.body}</p>
                <span className="text-sm text-gray-500 ml-2">{formatDate(`${conversation.createdAt}`)}</span>
              </div>
            </Link>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
