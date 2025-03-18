'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pages from '@/lib/constants/pages';
import { useAuth } from '@/lib/hooks/use-auth-id.hook';
import { formatDate } from '@/lib/utils';
import { IConversationDocument } from '@cngvc/shopi-types';
import Link from 'next/link';
import { useMemo } from 'react';

const ConversationItem = ({ conversation, isOnline }: { conversation: IConversationDocument; isOnline: boolean }) => {
  const id = useAuth();

  const partner = useMemo(() => {
    return conversation.participants.find((e) => e.authId !== id);
  }, [id, conversation.participants]);

  return (
    <Link
      className="py-2 border-b grid grid-cols-[48px_1fr] gap-2"
      href={`${pages.messages}/${conversation.conversationPublicId}`}
      key={conversation.conversationPublicId}
    >
      <div className="flex items-start pt-1 justify-start relative">
        <Avatar className="h-10 w-10 overflow-visible">
          <AvatarImage src="" alt={`User avatar ${name}`} />
          <AvatarFallback>{(partner?.username || '-')[0].toUpperCase()}</AvatarFallback>
          {isOnline && <div className="w-3 h-3 rounded-full bg-green-500 absolute bottom-0.5 right-0.5"></div>}
        </Avatar>
      </div>

      <div className="flex flex-col flex-1 justify-center">
        <p className="font-medium">{partner?.username || '-'}</p>
        <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-2 w-full">
          <p className="flex-1 text-sm text-gray-500 truncate">{conversation.lastMessage?.body || '-'}</p>
          <span className="flex-1 col-auto text-sm text-gray-500 text-right">{formatDate(`${conversation.updatedAt}`)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ConversationItem;
