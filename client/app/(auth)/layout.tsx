import { auth } from '@/auth';
import pages from '@/lib/constants/pages';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) {
    redirect(pages.home);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 wrapper">{children}</main>
    </div>
  );
}
