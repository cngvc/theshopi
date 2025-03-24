'use client';

import Loading from '@/components/shared/loading';
import { signinWithSSO } from '@/lib/actions/auth.action';
import useFingerprint from '@/lib/hooks/use-fp.hook';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const { fingerprint } = useFingerprint();
  const isSubmitted = useRef<boolean>(false);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (!isSubmitted.current && accessToken && refreshToken && fingerprint) {
      isSubmitted.current = true;
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
