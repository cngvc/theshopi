import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StoreSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex gap-2 items-center py-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 w-full flex-1">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-2 w-3/5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreSkeleton;
