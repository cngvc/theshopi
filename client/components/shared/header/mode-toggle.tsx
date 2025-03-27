'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ModeToggle = () => {
  const [mounted, $mounted] = useState(false);
  const { theme, setTheme: $theme } = useTheme();

  useEffect(() => {
    $mounted(true);
  }, []);

  if (!mounted) return <Skeleton className="w-10 h-9 rounded-md" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="focus-visible:ring-0 focus-visible:ring-offset-0">
          {theme === 'system' ? <SunIcon /> : theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          <p className="md:hidden">Theme</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === 'system'}
          onClick={() => {
            $theme('system');
          }}
        >
          System
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === 'dark'}
          onClick={() => {
            $theme('dark');
          }}
        >
          Dark
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === 'light'}
          onClick={() => {
            $theme('light');
          }}
        >
          Light
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
