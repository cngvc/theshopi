'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/hooks/use-auth-id.hook';
import { useConversation } from '@/lib/hooks/use-conversation.hook';
import { useMessages } from '@/lib/hooks/use-messages.hook';
import { useSendMessage } from '@/lib/hooks/use-send-message.hook';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useEffect, useMemo, useRef } from 'react';
import MessageItem from './message-item';
import MessageSkeleton from './message-skeleton';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const renderLoadingState = () => (
  <Card className="flex-1 max-md:hidden pb-0">
    <CardHeader>
      <CardTitle>@username</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col flex-1">
      <MessageSkeleton />
    </CardContent>
  </Card>
);

const renderEmptyState = () => (
  <Card className="flex-1 max-md:hidden">
    <div className="p-6 text-center mt-4">
      <h2 className="text-xl mb-2">No chats selected</h2>
    </div>
  </Card>
);

const MessageBox = ({ conversationPublicId }: { conversationPublicId: string }) => {
  const { id } = useAuth();
  const editorRef = useRef<Quill | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const { data: messages, isLoading: fetchMessageLoading } = useMessages(conversationPublicId);
  const { mutateAsync: sendMessageMutation } = useSendMessage();
  const { data: conversation, isLoading: fetchConversationLoading } = useConversation(conversationPublicId);

  useEffect(() => {
    if (messages && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView(false);
    }
  }, [messages]);

  const partner = useMemo(() => {
    return conversation?.participants?.find((e) => e.authId !== id);
  }, [id, conversation?.participants]);

  const handleSubmit = async ({ content }: { content: string }) => {
    if (!conversation || !conversation.conversationPublicId || !content?.length || !partner) return;

    editorRef?.current?.enable(false);
    editorRef?.current?.setText('');

    await sendMessageMutation({
      conversationPublicId: conversation.conversationPublicId,
      receiverAuthId: `${partner.authId}`,
      body: content
    });

    editorRef?.current?.enable(true);
  };

  const renderMessages = useMemo(
    () => (
      <ScrollArea className="flex-1 max-h-[calc(100vh-348px)] border-b">
        {fetchMessageLoading && <MessageSkeleton />}
        {messages?.map((message) => {
          const sender = conversation?.participants.find((participant) => participant.authId === message.senderAuthId)?.username || '-';
          return <MessageItem key={message.messagePublicId} message={message} sender={sender} />;
        })}
      </ScrollArea>
    ),
    [fetchMessageLoading, messages, conversation?.participants]
  );

  if (fetchConversationLoading) return renderLoadingState();
  if (!fetchConversationLoading && !conversation) return renderEmptyState();

  return (
    <Card className="flex-1 max-md:hidden">
      <CardHeader>
        <CardTitle>@{`${partner?.username || '-'}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {renderMessages}
        <div ref={lastMessageRef} />
      </CardContent>
      <CardFooter className="flex flex-col w-full">
        <Editor innerRef={editorRef} onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
};

export default MessageBox;
