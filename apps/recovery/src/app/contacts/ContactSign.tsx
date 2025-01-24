'use client';
import AddressWithChain from '@/components/AddressWithChain';
import { useAccount, useSignTypedData } from 'wagmi';
import { useRecoveryRecord } from '@/contexts';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  getWalletNonce,
  SocialRecoveryContractConfig,
} from '@/requests/contract';
import { getAccount, signTypedData } from 'wagmi/actions';
import { SocialRecovery } from '@soulwallet/sdk';
import { Address, TypedData } from 'viem';
import { getConfig } from '@/wagmi';
import { mutate } from '@/requests/client';
import { MUTATION_ADD_CONTACT_SIGNATURE } from '@/requests/gqls';
import { toast } from '@/hooks/use-toast';

export default function ContactSign() {
  const { address, isConnected, connector } = useAccount();
  const { recoveryRecord } = useRecoveryRecord();

  const sendSignatureRequest = async () => {
    try {
      const nonce = await getWalletNonce(
        address,
        Number(recoveryRecord?.chainID)
      );

      if (nonce === null) return;

      const typedData = SocialRecovery.getSocialRecoveryTypedData(
        Number(recoveryRecord?.chainID),
        SocialRecoveryContractConfig.address,
        address as Address,
        nonce,
        recoveryRecord?.newOwners as []
      );

      console.log(typedData, '--');

      const signature = await signTypedData(getConfig(), {
        connector,
        domain: {
          name: 'SocialRecovery',
          version: '1',
          chainId: 11155420,
          verifyingContract: '0x36693563E41BcBdC8d295bD3C2608eb7c32b1cCb',
        },
        types: {
          SocialRecovery: [
            {
              name: 'wallet',
              type: 'address',
            },
            {
              name: 'nonce',
              type: 'uint256',
            },
            {
              name: 'newOwners',
              type: 'bytes32[]',
            },
          ],
        },
        message: {
          wallet: '0xb9d3eF27DDBAD4D361A412dc419EBB3A7Ee586c5',
          nonce: BigInt(0),
          newOwners: [
            '0x0000000000000000000000008459D498fe9f19a076Ec06fc49d6c624294b06a4',
          ],
        },
        primaryType: 'SocialRecovery',
      });

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
        disabled={!isConnected}
        onClick={() => {
          console.log('sendSignatureRequest');
          sendSignatureRequest();
        }}
      >
        Sign
      </Button>
    </div>
  );
}
