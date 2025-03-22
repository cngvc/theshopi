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
import pages from '@/lib/constants/pages';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import SignoutButton from './signout-button';

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
  const firstCharacter = session.user.name!.charAt(0).toUpperCase();

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
          <div className="flex flex-col py-1">
            <DropdownMenuLabel className="py-0 text-sm font-medium leading-tight line-clamp-1 break-all">
              {session?.user?.name}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="py-0 text-sm text-muted-foreground font-medium break-all leading-tight">
              {session?.user?.email}
            </DropdownMenuLabel>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Button className="w-full px-2 justify-start" variant={'ghost'} asChild>
              <Link href={pages.account_shipping_address}>Account Settings</Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Button className="w-full px-2 justify-start" variant={'ghost'} asChild>
              <Link href={pages.purchases_all}>My Purchases</Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <SignoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
