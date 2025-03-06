import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export const metadata = {
  title: 'Home'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
