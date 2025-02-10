import {
  approvalService,
  ApprovalTypeEn,
} from '@/background/services/approval';
import { SUPPORTED_CHAIN_IDS } from '@/constants/chains';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';
import { ethErrors } from 'eth-rpc-errors';

const SWITCH_CHAIN_METHODS: ProviderMethodType[] = [
  'wallet_switchEthereumChain',
];

const ADD_CHAIN_METHODS: ProviderMethodType[] = ['wallet_addEthereumChain'];

const RELATED_METHODS: ProviderMethodType[] = [
  ...SWITCH_CHAIN_METHODS,
  ...ADD_CHAIN_METHODS,
];

export const requestChain: TFlowMiddleWareFn = async (ctx, next) => {
  const {
    rpcReq: { method, params },
    dApp,
  } = ctx.request;

  if (!RELATED_METHODS.includes(method)) {
    return next();
  }

  // Hex to
  const { chainId } = params?.[0] ?? {};

  if (!SUPPORTED_CHAIN_IDS.includes(Number(chainId))) {
    return ethErrors.provider.custom({
      code: 4902,
      message: `Unrecognized chain ID ${chainId}.`,
    });
  }

  return await approvalService.request(ApprovalTypeEn.ChainChange, {
    dApp,
    chain: {
      method: method === 'wallet_switchEthereumChain' ? 'switch' : 'add',
      ...params?.[0],
    },
  });
};
