'use client';

import Editor from '@/components/editor';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversation } from '@/lib/hooks/use-conversation.hook';
import { useParamId } from '@/lib/hooks/use-id.hook';
import { useMessages } from '@/lib/hooks/use-messages.hook';
import { useSendMessage } from '@/lib/hooks/use-send-message.hook';
import { useSession } from 'next-auth/react';
import Quill from 'quill';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import Message from './message';

const MessageBox = () => {
  const editorRef = useRef<Quill | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const id = useParamId();
  const session = useSession();
  const { data: messages, isLoading: fetchMessageLoading } = useMessages(id);
  const sendMessageMutation = useSendMessage();
  const { data: conversation, isLoading: fetchConversationLoading } = useConversation(id);

  const name = useMemo(() => {
    if (!conversation) return { sender: 'Username', receiver: null };
    return session?.data?.user?.username === conversation?.senderUsername
      ? { sender: `${conversation.senderUsername}`, receiver: `${conversation.receiverUsername}` }
      : { sender: `${conversation.receiverUsername}`, receiver: `${conversation.senderUsername}` };
  }, [conversation, session]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current!.scrollIntoView(false);
    }
  }, [messages]);

  const handleSubmit = async () => {
    try {
      editorRef?.current?.enable(false);
      const content = editorRef.current?.getText();
      editorRef?.current?.setText('');
      if (!conversation) {
        throw new Error();
      }
      if (!content?.length) {
        return null;
      }
      sendMessageMutation.mutate({
        conversationId: conversation.conversationId,
        senderUsername: name.sender!,
        receiverUsername: name.receiver!,
        body: content
      });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      editorRef?.current?.enable(true);
    }
  };

  return (
    <Card className="flex-1 md:col-span-4 max-md:hidden pb-0">
      <CardHeader>
        <CardTitle>{fetchConversationLoading ? <Skeleton className="h-4 w-2/5" /> : name.receiver}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1 max-h-[calc(100vh-388px)]">
          {fetchMessageLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {messages?.map((message) => <Message key={`${message._id}`} message={message} />)}
          <div ref={lastMessageRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col w-full">
        <Editor innerRef={editorRef} placeholder={'Type your message ...'} onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
};

export default MessageBox;
