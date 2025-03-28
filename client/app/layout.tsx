import '@/assets/globals.css';
import FpInitializer from '@/components/shared/fp-initializer';
import SocketInitializer from '@/components/shared/socket/socket-initializer';
import { SERVER_URL } from '@/lib/configs';
import { APP_DESC, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Providers from '@/providers';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: `%s | Shopi`,
    default: APP_NAME
  },
  description: APP_DESC,
  metadataBase: new URL(SERVER_URL)
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen flex flex-col')}>
        <Providers>
          {children}
          <SocketInitializer />
          <FpInitializer />
        </Providers>
      </body>
    </html>
  );
}
