'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupWithCredentials } from '@/lib/actions/auth.action';
import pages from '@/lib/constants/pages';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const CredentialsSignupForm = () => {
  const [data, action] = useActionState(signupWithCredentials, {
    success: false,
    message: ''
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || pages.home;

  const SignupButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant={'default'}>
        {pending ? 'Loading...' : 'Sign Up'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            required
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            defaultValue={''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" required type="email" autoComplete="email" placeholder="Enter your email" defaultValue={''} />
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
            defaultValue={''}
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
            defaultValue={''}
          />
        </div>

        <SignupButton />

        {data && !data?.success && <div className="text-center text-destructive">{data.message}</div>}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href={pages.signin} target="_self">
            Signin
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignupForm;
