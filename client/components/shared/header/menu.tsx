import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import pages from '@/lib/constants/pages';
import { EllipsisVerticalIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import ModeToggle from './mode-toggle';

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant={'ghost'}>
          <Link href={'/cart'}>
            <ShoppingCartIcon /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href={pages.signin}>
            <UserIcon /> Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVerticalIcon />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-4">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <ModeToggle />
            <Button asChild variant={'ghost'}>
              <Link href={'/cart'}>
                <ShoppingCartIcon /> Cart
              </Link>
            </Button>
            <Button asChild>
              <Link href={'/sign-in'}>
                <UserIcon /> Sign In
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
