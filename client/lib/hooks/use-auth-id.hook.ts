'use client';

import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const session = useSession();
  return session?.data?.user?.id || null;
};
