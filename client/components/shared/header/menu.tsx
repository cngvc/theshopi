import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EllipsisVerticalIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import ModeToggle from './mode-toggle';
import UserButton from './user-button';

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-2 items-center">
        <ModeToggle />
        <Button asChild variant={'ghost'}>
          <Link href={'/cart'}>
            <ShoppingCartIcon /> Cart
          </Link>
        </Button>
        <UserButton />
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
            <UserButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
