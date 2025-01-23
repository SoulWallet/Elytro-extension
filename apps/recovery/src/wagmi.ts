import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import {
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
} from 'wagmi/chains';
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from 'wagmi/connectors';

const WALLETCONNECT_PROJECT_ID = '8cbad7c19c42240ceef404623a8e5efc';

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      injected(),
      metaMask(),
      coinbaseWallet({
        appName: 'Elytro Account Recovery',
      }),
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [optimism.id]: http(),
      [optimismSepolia.id]: http(),
      [scroll.id]: http(),
      [scrollSepolia.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
