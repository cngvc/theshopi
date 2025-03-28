'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupWithCredentials } from '@/lib/actions/auth.action';
import { GATEWAY_URL } from '@/lib/configs';
import pages from '@/lib/constants/pages';
import useFingerprint from '@/lib/hooks/use-fp.hook';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const CredentialsSignupForm = () => {
  const [data, action] = useActionState(signupWithCredentials, {
    success: false,
    message: ''
  });

  const { fingerprint } = useFingerprint();

  const handleLoginWithGithub = async () => {
    window.location.href = `${GATEWAY_URL}/auth/github?fingerprint=${fingerprint}`;
  };

  const SignupButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" size={'lg'} variant={'default'}>
        {pending ? 'Loading...' : 'Sign Up'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            required
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            defaultValue={'joevu98+8'}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            defaultValue={'joevu98+8@gmail.com'}
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
            defaultValue={'joevu98+8'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            autoComplete="confirmPassword"
            placeholder="Enter your confirm password"
            defaultValue={'joevu98+8'}
          />
        </div>

        <SignupButton />
        <Button className="w-full" size={'lg'} type="button" variant={'default'} onClick={handleLoginWithGithub}>
          <SiGithub className="text-background size-5" /> Signin with Github
        </Button>
        <Button disabled className="w-full" size={'lg'} variant={'default'}>
          <SiGoogle className="text-background size-5" /> Signin with Google
        </Button>

        {data && !data?.success && <div className="text-center text-destructive">{data.message}</div>}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href={pages.signin} target="_self" className="text-blue-500">
            Signin
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignupForm;
