import { Button } from '@/components/ui/button';
import pages from '@/lib/constants/pages';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unauthorized Access'
};

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-lg">
      <div className="p-6 text-center mt-4">
        <h1 className="text-2xl mb-2">Unauthorized Access</h1>
        <p className="text-destructive mb-4">You do not have permission to access this page!</p>
        <Button asChild variant={'outline'}>
          <Link href={pages.home}>Back To Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
