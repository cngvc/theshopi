'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pages from '@/lib/constants/pages';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared-types';
import Link from 'next/link';

const ConversationItem = ({ conversation, name, isOnline }: { conversation: IMessageDocument; name: string; isOnline: boolean }) => {
  return (
    <Link
      className="py-2 border-b flex space-x-4"
      href={`${pages.messages}/${conversation?.conversationId}`}
      key={conversation.conversationId}
    >
      <div className="flex items-start pt-1 justify-start relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" alt={`User avatar ${name}`} />
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && <div className="w-3 h-3 rounded-full bg-green-500 absolute bottom-0 right-0"></div>}
      </div>
      <div className="flex flex-col flex-1 justify-center">
        <p className="font-medium">{name}</p>
        <div className="flex justify-between items-center">
          <p className="flex-1 truncate text-sm text-gray-500">{conversation.body}</p>
          <span className="text-sm text-gray-500 ml-2">{formatDate(`${conversation.createdAt}`)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;
