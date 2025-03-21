import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pages from '@/lib/constants/pages';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Account'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-left">My Purchases</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href={pages.purchases_all} className="flex items-center gap-2">
              <ShoppingCartIcon className="w-4 h-4" /> All
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
