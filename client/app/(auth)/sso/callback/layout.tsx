import { auth } from '@/auth';
import pages from '@/lib/constants/pages';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user) {
    redirect(pages.home);
  }
  return <div className="flex flex-col flex-1">{children}</div>;
}
