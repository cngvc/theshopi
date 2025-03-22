'use client';

import { Button } from '@/components/ui/button';
import { signoutUser } from '@/lib/actions/auth.action';

const SignoutButton = () => {
  return (
    <form action={signoutUser} className="flex-1">
      <Button className="w-full px-2 justify-start" variant={'ghost'}>
        Signout
      </Button>
    </form>
  );
};

export default SignoutButton;
