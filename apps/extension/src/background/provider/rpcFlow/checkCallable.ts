import {
  approvalService,
  ApprovalTypeEn,
} from '@/background/services/approval';
import type { TFlowMiddleWareFn } from '@/utils/asyncTaskFlow';

export interface UnsupportedMethod {
  name: string;
  reason: string;
}

const UNSUPPORTED_METHODS: Record<string, string> = {
  eth_sign: 'Elytro is not supported eth_sign because of security reasons',
  eth_getEncryptionPublicKey:
    'Elytro is a smart wallet, not supported eth_getEncryptionPublicKey yet',
};

// These methods are banned when the account is not deployed
// const BANNED_METHODS_WITHOUT_DEPLOYMENT: ProviderMethodType[] = [
//   'eth_signTypedData_v4',
//   'eth_signTypedData_v3',
//   'eth_signTypedData',
//   'eth_sendTransaction',
//   'eth_getTransactionByHash',
//   'eth_decrypt',
//   'eth_requestAccounts',
//   'eth_accounts',
//   'wallet_getPermissions',
//   'wallet_requestPermissions',
//   'wallet_revokePermissions',
// ];

export const checkMethodExist: TFlowMiddleWareFn = async (ctx, next) => {
  const { rpcReq, dApp } = ctx.request;

  // TODO: comment out for now. bring back after fixing multiple requests issue
  // if (
  //   BANNED_METHODS_WITHOUT_DEPLOYMENT.includes(rpcReq.method) &&
  //   !accountManager.currentAccount?.isDeployed
  // ) {
  //   // TODO: Alert window may popup multiple times when there are multiple requests in a short time
  //   return await approvalService.request(ApprovalTypeEn.Alert, {
  //     dApp,
  //     options: {
  //       name: rpcReq.method,
  //       reason:
  //         'Your current account is not deployed yet, please deploy first.',
  //     },
  //   });
  // }

  const reason = UNSUPPORTED_METHODS[rpcReq.method];
  if (reason) {
    return await approvalService.request(ApprovalTypeEn.Alert, {
      dApp,
      options: { name: rpcReq.method, reason },
    });
  }

  return next();
};
