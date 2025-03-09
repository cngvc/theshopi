'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversation } from '@/lib/hooks/use-conversation.hook';
import { useMessages } from '@/lib/hooks/use-messages.hook';
import { useSendMessage } from '@/lib/hooks/use-send-message.hook';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import MessageItem from './message-item';
import MessageSkeleton from './message-skeleton';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const MessageBox = ({ id }: { id: string }) => {
  const editorRef = useRef<Quill | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { data: messages, isLoading: fetchMessageLoading } = useMessages(id);

  const { mutate: sendMessageMutation } = useSendMessage();
  const { data: conversation, isLoading: fetchConversationLoading } = useConversation(id);
  useEffect(() => {
    if (messages && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView(false);
    }
  }, [messages]);

  const handleSubmit = async ({ content }: { content: string }) => {
    try {
      editorRef?.current?.enable(false);
      editorRef?.current?.setText('');
      if (!conversation || !conversation.conversationPublicId) throw new Error();
      if (!content?.length) return null;
      sendMessageMutation({
        conversationPublicId: conversation.conversationPublicId!,
        receiverAuthId: `${conversation.counterpartId}`,
        body: content
      });
      editorRef?.current?.enable(true);
    } catch (error) {
      toast.error('Failed to send message, try again later.');
    }
  };

  if (fetchConversationLoading) {
    return (
      <Card className="flex-1 max-md:hidden  pb-0">
        <CardHeader>
          <CardTitle>@username</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <MessageSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!fetchConversationLoading && !conversation) {
    <Card className="flex-1 md:col-span-3 lg:col-span-4 max-md:hidden pb-0">
      <div className="p-6 text-center mt-4">
        <h2 className="text-xl mb-2">No chats selected</h2>
      </div>
    </Card>;
  }

  return (
    <Card className="flex-1 max-md:hidden">
      <CardHeader>
        <CardTitle>@{`${conversation!.counterpartName}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1 max-h-[calc(100vh-348px)] border-b">
          {fetchMessageLoading && <MessageSkeleton />}
          {messages?.map((message) => <MessageItem key={`${message.messagePublicId}`} message={message} />)}
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
