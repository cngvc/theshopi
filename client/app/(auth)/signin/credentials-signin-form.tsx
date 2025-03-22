'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signinWithCredentials } from '@/lib/actions/auth.action';
import { GATEWAY_URL } from '@/lib/configs';
import pages from '@/lib/constants/pages';
import useFingerprint from '@/lib/hooks/use-fp.hook';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const CredentialsSigninForm = () => {
  const [data, action] = useActionState(signinWithCredentials, {
    success: false,
    message: ''
  });
  const { fingerprint } = useFingerprint();

  const handleLoginWithGithub = async () => {
    window.location.href = `${GATEWAY_URL}/auth/github?fingerprint=${fingerprint}`;
  };

  const SigninButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant={'default'}>
        {pending ? 'Loading...' : 'Sign In'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="fingerprint" value={fingerprint || ''} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            required
            type="text"
            autoComplete="username"
            placeholder="Enter your email or username"
            defaultValue={'thurman_hayes83@gmail.com'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            autoComplete="password"
            placeholder="Enter your password"
            defaultValue={'Asdfgh123'}
          />
        </div>

        <SigninButton />
        <Button className="w-full" type="button" variant={'default'} onClick={handleLoginWithGithub}>
          <SiGithub className="text-background size-5" /> Signin with Github
        </Button>
        <Button disabled className="w-full" variant={'default'}>
          <SiGoogle className="text-background size-5" /> Signin with Google
        </Button>

        {data && !data?.success && <div className="text-center text-destructive">{data.message}</div>}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href={pages.signup} target="_self" className="text-blue-500">
            Create new one
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSigninForm;
