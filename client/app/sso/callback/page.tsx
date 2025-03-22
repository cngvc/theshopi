'use client';

import { Button } from '@/components/ui/button';
import { signinWithSSO } from '@/lib/actions/auth.action';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const [fingerprint, $fingerprint] = useState('');
  const [data, action] = useActionState(signinWithSSO, {
    success: false,
    message: ''
  });
  const formRef = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  //   if (formRef.current) {
  //     formRef.current.submit();
  //   }
  // }, []);

  // const Loading = () => {
  //   const { pending } = useFormStatus();
  //   if (pending) return <Loading />;
  //   return <div />;
  // };

  useEffect(() => {
    const fetchFP = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      $fingerprint(visitorId);
    };
    fetchFP();
  }, []);

  return (
    <form action={action} ref={formRef}>
      <input type="hidden" name="accessToken" defaultValue={searchParams.get('accessToken') || ''} />
      <input type="hidden" name="refreshToken" defaultValue={searchParams.get('refreshToken') || ''} />
      <input type="hidden" name="fingerprint" value={fingerprint} />

      <Button type="submit">submit</Button>
      {/* <Loading /> */}
    </form>
  );
};

export default Page;
