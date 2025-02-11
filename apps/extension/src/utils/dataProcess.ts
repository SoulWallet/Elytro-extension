import { DecodeResult } from '@soulwallet/decoder';

export const getTransferredTokenInfo = (decodeResult: DecodeResult) => {
  if (decodeResult.method?.name === 'transfer') {
    return {
      value: decodeResult.method.params[1],
      decimals: decodeResult.toInfo?.decimals || 18,
      symbol: decodeResult.toInfo?.symbol || '',
      logoURI: decodeResult.toInfo?.logoURI,
    };
  }

  return {
    value: decodeResult.value.toString(),
    decimals: 18,
    symbol: 'ETH',
    logoURI: 'https://etherscan.io/images/svg/brands/ethereum-original.svg',
  };
};
