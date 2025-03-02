'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signinWithCredentials } from '@/lib/actions/auth.action';
import pages from '@/lib/constants/pages';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const CredentialsSigninForm = () => {
  const [data, action] = useActionState(signinWithCredentials, {
    success: false,
    message: ''
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || pages.home;

  const SigninButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant={'default'} type="submit">
        {pending ? 'Loading...' : 'Sign In'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required type="text" autoComplete="username" defaultValue={'backstagepro'} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" required type="text" autoComplete="password" defaultValue={'Asdfgh123'} />
        </div>

        <SigninButton />

        {data && !data?.success && <div className="text-center text-destructive">{data.message}</div>}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href={'signup'} target="_self">
            Signup
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSigninForm;
