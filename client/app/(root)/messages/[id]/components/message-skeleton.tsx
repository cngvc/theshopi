import { Skeleton } from '@/components/ui/skeleton';

const MessageItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 py-2 border-b">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 w-full flex-1">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
};

const MessageSkeleton = () => {
  return (
    <>
      <MessageItemSkeleton />
      <MessageItemSkeleton />
      <MessageItemSkeleton />
      <MessageItemSkeleton />
      <MessageItemSkeleton />
      <MessageItemSkeleton />
      <MessageItemSkeleton />
      <MessageItemSkeleton />
    </>
  );
};

export default MessageSkeleton;
