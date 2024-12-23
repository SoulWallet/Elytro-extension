import accountManager from '@/background/services/account';
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

export const checkMethodExist: TFlowMiddleWareFn = async (ctx, next) => {
  const { rpcReq, dApp } = ctx.request;

  if (!accountManager.currentAccount?.isDeployed) {
    return await approvalService.request(ApprovalTypeEn.Alert, {
      dApp,
      options: {
        name: rpcReq.method,
        reason:
          'Your current account is not deployed yet, please deploy first.',
      },
    });
  }

  const reason = UNSUPPORTED_METHODS[rpcReq.method];
  if (reason) {
    return await approvalService.request(ApprovalTypeEn.Alert, {
      dApp,
      options: { name: rpcReq.method, reason },
    });
  }

  return next();
};
