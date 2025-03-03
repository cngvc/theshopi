import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signoutUser } from '@/lib/actions/auth.action';
import pages from '@/lib/constants/pages';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';

const UserButton = async () => {
  const session = await auth();

  if (!session?.user) {
    return (
      <Button asChild>
        <Link href={pages.signin}>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }
  const firstCharacter = session?.user?.name?.charAt(0).toUpperCase();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'ghost'}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 relative w-8 h-8 rounded-full flex items-center justify-center bg-gray-200"
          >
            {firstCharacter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="py-1 space-y-1">
            <DropdownMenuLabel>
              <div className="text-sm font-medium leading-0">{session?.user?.name}</div>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <div className="text-sm text-muted-foreground font-medium leading-0">{session?.user?.email}</div>
            </DropdownMenuLabel>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={signoutUser}>
              <Button className="w-full px-1 h-5 justify-start" variant={'ghost'}>
                Signout
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
