'use client';

import Loading from '@/components/shared/loading';
import { signinWithSSO } from '@/lib/actions/auth.action';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (accessToken && refreshToken) {
      signinWithSSO({
        accessToken,
        refreshToken
      });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-1 items-center">
      <Loading />
    </div>
  );
};

export default Page;
