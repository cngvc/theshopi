import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import pages from './constants/pages';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect(pages.signin);
  }
}
