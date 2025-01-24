'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';

import { getConfig } from '@/wagmi';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/requests/client';
import { RecoveryRecordProvider } from '@/contexts';
import { ToastProvider } from '@/components/ui/toast';

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <ToastProvider>
            <RecoveryRecordProvider>{props.children}</RecoveryRecordProvider>
          </ToastProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
