import { LoaderIcon } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2">
      <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};

export default Loading;
