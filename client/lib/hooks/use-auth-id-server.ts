import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import pages from '../constants/pages';

export const useAuthServer = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(pages.signin);
  }
  return session.user.id;
};
