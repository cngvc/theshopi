import { APP_NAME } from '@/lib/constants';
import pages from '@/lib/constants/pages';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';
import Search from './search';

const Header = () => {
  return (
    <header className="w-full border-b sticky top-0 z-50 bg-background">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href={pages.home} className="p-1 rounded-md bg-white">
            <Image
              src="/images/logo.png"
              alt={`${APP_NAME} logo`}
              height={26}
              width={130}
              priority={true}
              className="block flex-shrink-0 object-contain"
            />
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
