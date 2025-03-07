export const metadata = {
  title: 'My Cart'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 wrapper">{children}</main>
    </div>
  );
}
