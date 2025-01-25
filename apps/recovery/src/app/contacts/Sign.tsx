'use client';
import AddressWithChain from '@/components/AddressWithChain';
import { useAccount } from 'wagmi';
import { useRecoveryRecord } from '@/contexts';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  getSocialRecoveryTypedData,
  getWalletNonce,
} from '@/requests/contract';
import { signTypedData } from 'wagmi/actions';
import { Address } from 'viem';
import { getConfig } from '@/wagmi';
import { mutate } from '@/requests/client';
import { MUTATION_ADD_CONTACT_SIGNATURE } from '@/requests/gqls';
import { toast } from '@/hooks/use-toast';

export default function Sign() {
  const { address, isConnected, connector } = useAccount();
  const { recoveryRecord } = useRecoveryRecord();

  const isSigned = recoveryRecord?.guardianSignatures?.some(
    ({ guardian }) => guardian === address?.toLowerCase()
  );

  const sendSignatureRequest = async () => {
    try {
      const nonce = await getWalletNonce(
        recoveryRecord?.address,
        Number(recoveryRecord?.chainID)
      );

      if (nonce === null) return;

      const signature = await signTypedData(getConfig(), {
        ...getSocialRecoveryTypedData(
          recoveryRecord?.address as Address,
          Number(recoveryRecord?.chainID),
          nonce,
          recoveryRecord?.newOwners as []
        ),
        connector,
      } as any);

      if (signature) {
        await mutate(MUTATION_ADD_CONTACT_SIGNATURE, {
          input: {
            recoveryRecordID: recoveryRecord?.recoveryRecordID,
            guardian: address?.toLowerCase(),
            guardianSignature: signature,
          },
        });
      }

      toast({
        title: 'Success',
        description: 'Signature sent successfully',
      });
    } catch (error) {
      console.log(error, '--');
      toast({
        title: 'Failed to sign',
        description: 'Please try again',
      });
    }
  };

  return (
    <div>
      <AddressWithChain
        className="border !p-lg border-gray-300 rounded-[16px]"
        address={address}
        chainID={Number(recoveryRecord?.chainID)}
      />

      <Button
        className="w-full mt-lg"
        disabled={!isConnected || isSigned}
        onClick={sendSignatureRequest}
      >
        {isSigned ? 'You have already signed' : 'Sign'}
      </Button>
    </div>
  );
}
