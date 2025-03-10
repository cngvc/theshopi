'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useChatWithStore } from '@/lib/hooks/use-chat-store.hook';
import { IStoreDocument } from '@cngvc/shopi-shared-types';
import { Loader, MessageCircle } from 'lucide-react';

const StoreCard = ({ store }: { store: IStoreDocument }) => {
  const { mutate: chatWithStore, isPending } = useChatWithStore();

  const handleChatWithStore = async () => {
    chatWithStore(`${store.ownerAuthId}`);
  };
  return (
    <Card>
      <CardContent>
        <div className="flex w-full space-x-2">
          <div className="flex items-start justify-start relative">
            <Avatar className="h-8 w-8 overflow-visible pt-1">
              <AvatarImage src="" alt={`Store avatar ${store.username}`} />
              <AvatarFallback>{(store.username || '-')[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col flex-1 mb-4">
            <p className="font-medium text-sm line-clamp-1">{store.username}</p>
            <p className="flex-1 text-xs text-gray-500 line-clamp-2">{store.description || '-'}</p>
          </div>
        </div>
        <Button className="w-full" type="button" onClick={handleChatWithStore}>
          {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />} Chat
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
