'use client';

import AddressWithChain from '@/components/AddressWithChain';
import ContentWrapper from '@/components/ContentWrapper';
import { useRecoveryRecord } from '@/contexts';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import Sign from './Sign';
import Status from './Status';

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
        content: <Sign />,
      };
    }

    return {
      subtitle: 'Connect to the following wallet address to sign the recovery',
      content: <Status />,
    };
  }, [recoveryRecord, address]);

  return (
    <ContentWrapper
      title={
        <div className="text-left mr-5xl">Sign your friend’s recovery</div>
      }
      allSteps={3}
      currentStep={1}
      subtitle={subtitle}
    >
      {content}
    </ContentWrapper>
  );
}
