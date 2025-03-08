'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversation } from '@/lib/hooks/use-conversation.hook';
import { useMessages } from '@/lib/hooks/use-messages.hook';
import { useSendMessage } from '@/lib/hooks/use-send-message.hook';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useEffect, useMemo, useRef } from 'react';
import MessageItem from './message-item';
import MessageSkeleton from './message-skeleton';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const MessageBox = ({ id }: { id: string }) => {
  const editorRef = useRef<Quill | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const { data: messages, isLoading: fetchMessageLoading } = useMessages(id);

  const sendMessageMutation = useSendMessage();
  const { data: conversation, isLoading: fetchConversationLoading } = useConversation(id);

  const sub = useMemo(() => {
    if (!conversation) return undefined;
  }, [conversation, session]);

  useEffect(() => {
    if (messages && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView(false);
    }
  }, [messages]);

  const handleSubmit = async ({ content }: { content: string }) => {
    editorRef?.current?.enable(false);
    editorRef?.current?.setText('');
    if (!conversation || !sub) throw new Error();
    if (!content?.length) return null;
    sendMessageMutation.mutate({
      conversationId: conversation.conversationId,
      receiverId: sub,
      body: content
    });

    editorRef?.current?.enable(true);
  };

  if (!conversation) {
    return (
      <Card className="flex-1 md:col-span-3 lg:col-span-4 max-md:hidden pb-0">
        <div className="p-6 text-center mt-4">
          <h2 className="text-xl mb-2">No chats selected</h2>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 md:col-span-3 lg:col-span-4 max-md:hidden pb-0">
      <CardHeader>
        <CardTitle>{fetchConversationLoading ? <Skeleton className="h-5 w-2/5" /> : `${conversation.counterpartName}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1 max-h-[calc(100vh-388px)]">
          {fetchMessageLoading && <MessageSkeleton />}
          {messages?.map((message) => <MessageItem key={`${message._id}`} message={message} />)}
          <div ref={lastMessageRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col w-full">
        <Editor innerRef={editorRef} onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
};

export default MessageBox;
