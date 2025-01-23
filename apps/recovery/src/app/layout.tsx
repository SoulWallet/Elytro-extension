import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import { cookieToInitialState } from 'wagmi';

import { headers } from 'next/headers';
import { getConfig } from '../wagmi';
import { Providers } from './providers';
import ConnectControl from '@/components/ConnectControl';
import ApolloProviderWrapper from '@/requests/provider';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Elytro Recovery',
  description: "Help you recover your or your friend's Elytro accounts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resolvedHeaders = await headers();
  const initialState = cookieToInitialState(
    getConfig(),
    resolvedHeaders.get('cookie')
  );

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased w-screen h-screen screen-bg min-w-[800px]`}
      >
        <Providers initialState={initialState}>
          <ApolloProviderWrapper>
            <header className="fixed top-0 left-0 right-0 flex items-center justify-between gap-2 px-xl py-lg">
              <div className="flex flex-row items-center gap-2">
                <Image
                  className="dark:invert"
                  src="/logo.svg"
                  alt="Elytro"
                  width={20}
                  height={20}
                  priority
                />
                <span className="text-title">Elytro</span>
              </div>

              <div className="flex flex-row items-center gap-2">
                <ConnectControl />
              </div>
            </header>
            <main className="pt-14 h-full flex flex-col items-center justify-center">
              {children}
            </main>
          </ApolloProviderWrapper>
        </Providers>
      </body>
    </html>
  );
}
