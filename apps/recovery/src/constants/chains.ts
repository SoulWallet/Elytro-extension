import {
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
  Chain,
} from 'wagmi/chains';

export const SUPPORTED_CHAINS: readonly [Chain, ...Chain[]] = [
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
];

export const CHAIN_LOGOS: Record<number, string> = {
  [mainnet.id]: 'https://icons.llamao.fi/icons/chains/rsz_ethereum',
  [sepolia.id]: 'https://icons.llamao.fi/icons/chains/rsz_ethereum',
  [optimism.id]: 'https://icons.llamao.fi/icons/chains/rsz_optimism',
  [optimismSepolia.id]: 'https://icons.llamao.fi/icons/chains/rsz_optimism',
  [scroll.id]: 'https://icons.llamao.fi/icons/chains/rsz_scroll',
  [scrollSepolia.id]: 'https://icons.llamao.fi/icons/chains/rsz_scroll',
};
