import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pages from '@/lib/constants/pages';
import { CreditCardIcon, HomeIcon } from 'lucide-react';
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
            <CardTitle className="text-left">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href={pages.account_shipping_address} className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" /> Shipping Address
            </Link>
            <Link href={pages.account_payment} className="flex items-center gap-2">
              <CreditCardIcon className="w-4 h-4" /> Payment Methods
            </Link>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>
      </Card>
    </div>
  );
}
