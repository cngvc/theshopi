'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pages from '@/lib/constants/pages';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared-types';
import Link from 'next/link';
import { useMemo } from 'react';

const ConversationItem = ({ conversation, currentUser }: { conversation: IMessageDocument; currentUser?: string }) => {
  const conversationName = useMemo(() => {
    return currentUser === conversation.senderUsername ? `${conversation.receiverUsername}` : `${conversation.senderUsername}`;
  }, [currentUser, conversation]);
  return (
    <Link
      className="py-2 border-b flex space-x-4"
      href={`${pages.messages}/${conversation?.conversationId}`}
      key={conversation.conversationId}
    >
      <div className="flex items-start pt-1 justify-start">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" alt={`User avatar ${conversationName}`} />
          <AvatarFallback>{conversationName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col flex-1 justify-center">
        <p className="font-medium">{conversationName}</p>
        <div className="flex justify-between items-center">
          <p className="flex-1 truncate text-sm text-gray-500">{conversation.body}</p>
          <span className="text-sm text-gray-500 ml-2">{formatDate(`${conversation.createdAt}`)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;
