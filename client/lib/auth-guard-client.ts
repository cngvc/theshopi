import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import pages from './constants/pages';

export function requireAuth() {
  const { data } = useSession();
  const router = useRouter();
  if (!data?.user) {
    router.push(pages.signin);
  }
}
