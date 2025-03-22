'use client';

import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data, status } = useSession();
  return status === 'authenticated' && data.user
    ? {
        id: data.user!.id,
        email: data.user!.email,
        name: data.user!.name,
        refreshToken: data.refreshToken,
        accessToken: data.accessToken
      }
    : {
        id: null,
        email: null,
        name: null,
        refreshToken: null,
        accessToken: null
      };
};
