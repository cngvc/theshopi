import { Skeleton } from '@/components/ui/skeleton';

const MessageItemSkeleton = () => {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-2 items-center py-2 border-b">
      <Skeleton className="h-10 w-10 rounded-full" />
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
