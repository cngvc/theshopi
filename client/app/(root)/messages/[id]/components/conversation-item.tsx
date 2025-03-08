'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pages from '@/lib/constants/pages';
import { formatDate } from '@/lib/utils';
import { IConversationDocument } from '@cngvc/shopi-shared-types';
import Link from 'next/link';

const ConversationItem = ({ conversation, isOnline }: { conversation: IConversationDocument; isOnline: boolean }) => {
  const name = `${conversation.counterpartName || ''}`;
  return (
    <Link
      className="py-2 border-b flex w-full space-x-4"
      href={`${pages.messages}/${conversation?.conversationPublicId}`}
      key={conversation.conversationPublicId}
    >
      <div className="flex items-start pt-1 justify-start relative">
        <Avatar className="h-12 w-12 overflow-visible">
          <AvatarImage src="" alt={`User avatar ${name}`} />
          <AvatarFallback>{(name || '-')[0].toUpperCase()}</AvatarFallback>
          {isOnline && <div className="w-3 h-3 rounded-full bg-green-500 absolute bottom-0.5 right-0.5"></div>}
        </Avatar>
      </div>

      <div className="flex flex-col flex-1 justify-center">
        <p className="font-medium">{name}</p>
        <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-2 w-full">
          <p className="flex-1 text-sm text-gray-500 truncate">{conversation.lastMessage?.body || '-'}</p>
          <span className="flex-1 col-auto text-sm text-gray-500 text-right">{formatDate(`${conversation.updatedAt}`)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;
