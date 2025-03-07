import { Button } from '@/components/ui/button';
import pages from '@/lib/constants/pages';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-lg">
      <div className="p-6 text-center mt-4">
        <h1 className="text-2xl mb-2">Not Found</h1>
        <p className="text-destructive mb-4">It looks like something is missing!</p>
        <Button asChild variant={'outline'}>
          <Link href={pages.home}>Back To Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
