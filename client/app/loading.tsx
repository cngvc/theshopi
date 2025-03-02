import { LoaderIcon } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
};

export default LoadingPage;
