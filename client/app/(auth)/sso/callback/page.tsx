'use client';

import Loading from '@/components/shared/loading';
import { signinWithSSO } from '@/lib/actions/auth.action';
import useFingerprint from '@/lib/hooks/use-fp.hook';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const { fingerprint } = useFingerprint();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (accessToken && refreshToken && fingerprint) {
      signinWithSSO({
        accessToken,
        refreshToken,
        fingerprint
      });
    }
  }, [searchParams, fingerprint]);

  return (
    <div className="flex flex-1 items-center">
      <Loading />
    </div>
  );
};

export default Page;
