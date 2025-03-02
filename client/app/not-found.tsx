'use client';

import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-lg">
      <div className="p-6 text-center mt-4">
        <h1 className="text-2xl mb-2">Not Found</h1>
        <p className="text-destructive mb-4">Could not find requested page</p>
        <Button
          variant={'outline'}
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
