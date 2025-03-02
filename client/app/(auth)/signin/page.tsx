'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import CredentialsSigninForm from './credentials-signin-form';

const SigninPage = () => {
  const session = useSession();

  // if (session.data) {
  //   redirect(pages.home);
  // }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={'/'} className="flex-center">
            <Image src={'/images/logo.png'} width={130} height={26} alt={`${APP_NAME} logo`} priority={true} />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>

          <CardContent className="space-y-4">
            <CredentialsSigninForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SigninPage;
