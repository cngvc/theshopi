import "@/assets/globals.css";
import { APP_DESC, APP_NAME, SERVER_URL } from "@/lib/constants";
import Providers from "@/providers";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | Shopi`,
    default: APP_NAME
  },
  description: APP_DESC,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
