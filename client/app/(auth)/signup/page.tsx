import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import pages from '@/lib/constants/pages';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CredentialsSignupForm from './credentials-signup-form';

const SignupPage = async (props: { searchParams: Promise<{ callbackUrl: string }> }) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session?.user) {
    redirect(callbackUrl || pages.home);
  }

  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col justify-center">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={pages.home} className="flex-center">
            <Image src={'/images/logo.png'} width={130} height={26} alt={`${APP_NAME} logo`} priority={true} />
          </Link>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Create a new account</CardDescription>

          <CardContent className="space-y-4">
            <CredentialsSignupForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignupPage;
