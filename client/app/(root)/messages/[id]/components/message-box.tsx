'use client';

import Editor from '@/components/editor';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useParamId } from '@/lib/hooks/use-id.hook';
import { useMessages } from '@/lib/hooks/use-messages.hook';
import Quill from 'quill';
import { useRef } from 'react';
import Message from './message';
import MessageBoxHeader from './message-box-header';

const MessageBox = () => {
  const editorRef = useRef<Quill | null>(null);
  const id = useParamId();
  const { data, isLoading } = useMessages(id);

  return (
    <Card className="flex-1 md:col-span-4 max-md:hidden pb-0">
      <MessageBoxHeader />
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1 max-h-[calc(100vh-388px)]">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {data?.map((message) => <Message key={`${message._id}`} message={message} />)}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col w-full">
        <Editor innerRef={editorRef} placeholder={'Type your message ...'} onSubmit={() => {}} disabled={false} />
      </CardFooter>
    </Card>
  );
};

export default MessageBox;
