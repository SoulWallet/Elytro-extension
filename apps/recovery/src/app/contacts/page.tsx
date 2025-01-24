'use client';

import AddressWithChain from '@/components/AddressWithChain';
import ContentWrapper from '@/components/ContentWrapper';
import { Button } from '@/components/ui/button';
import { useRecoveryRecord } from '@/contexts';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import ContactSign from './ContactSign';

export default function Contacts() {
  const { recoveryRecord } = useRecoveryRecord();
  const { address } = useAccount();

  const { subtitle, content } = useMemo(() => {
    const isGuardian =
      address &&
      recoveryRecord?.guardianInfo?.guardians?.includes(address.toLowerCase());

    if (isGuardian) {
      return {
        subtitle: 'Please sign the recovery',
        content: <ContactSign />,
      };
    }

    return {
      subtitle: 'Connect wallet address which in below list',
      content: (
        <div className="flex flex-col w-full gap-y-md ">
          {recoveryRecord?.guardianInfo?.guardians?.map((guardian) => (
            <AddressWithChain
              className="border !p-lg border-gray-300 rounded-[16px]"
              key={guardian}
              address={guardian}
              chainID={Number(recoveryRecord?.chainID)}
            />
          ))}
        </div>
      ),
    };
  }, [recoveryRecord, address]);

  return (
    <ContentWrapper
      title={<div className="mr-5xl">Sign your friend’s recovery</div>}
      allSteps={3}
      currentStep={1}
      subtitle={subtitle}
    >
      {content}
    </ContentWrapper>
  );
}
