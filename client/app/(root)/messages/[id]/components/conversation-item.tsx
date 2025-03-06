'use server';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pages from '@/lib/constants/pages';
import { formatDate } from '@/lib/utils';
import { IMessageDocument } from '@cngvc/shopi-shared-types';
import Link from 'next/link';

const ConversationItem = async ({ conversation, user }: { conversation: IMessageDocument; user: string }) => {
  return (
    <Link className="py-2 border-b flex" href={`${pages.messages}/${conversation?.conversationId}`} key={conversation.conversationId}>
      <div className="flex items-start pt-1 justify-start w-12">
        <Avatar>
          <AvatarImage src="" alt={`User avatar ${user}`} />
          <AvatarFallback>{user[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-medium">{user}</p>
        <div className="flex justify-between items-center">
          <p className="flex-1 truncate text-sm text-gray-500">{conversation.body}</p>
          <span className="text-sm text-gray-500 ml-2">{formatDate(`${conversation.createdAt}`)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;
