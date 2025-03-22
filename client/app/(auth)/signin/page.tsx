import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import pages from '@/lib/constants/pages';
import Image from 'next/image';
import Link from 'next/link';
import CredentialsSigninForm from './credentials-signin-form';

const Page = () => {
  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col justify-center">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={pages.home} className="flex-center">
            <Image src={'/images/logo.png'} width={130} height={26} alt={`${APP_NAME} logo`} priority={true} />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <CredentialsSigninForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
