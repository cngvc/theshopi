import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
          <Avatar className="cursor-pointer">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback>{firstCharacter}</AvatarFallback>
          </Avatar>
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
          <DropdownMenuItem className="p-0">
            <form action={signoutUser} className="flex-1">
              <input type="hidden" name="callbackUrl" value={'/sign-in'} />
              <Button className="w-full px-2 justify-start" variant={'ghost'}>
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
