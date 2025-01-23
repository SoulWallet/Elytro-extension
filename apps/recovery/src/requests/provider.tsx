'use client';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/requests/client';

// Wrap ApolloProvider with client into this otherwise it will be server side rendered and not work
export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
