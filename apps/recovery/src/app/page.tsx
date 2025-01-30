'use client';

import { useRecoveryRecord } from '@/contexts';
import { LoaderCircle } from 'lucide-react';
import AddressWithChain from '@/components/AddressWithChain';
import ContentWrapper from '@/components/ContentWrapper';
import { Button } from '@/components/ui/button';
import { Clock, Search, Shield } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { TRecoveryStatus } from '@/constants/enums';

interface ITipBlockProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TipBlock = ({ title, description, icon }: ITipBlockProps) => {
  return (
    <div className="flex flex-col gap-x-xl w-[128px]">
      {icon}
      <div className="text-small-bold mt-md mb-2xs">{title}</div>
      <div className="text-tiny whitespace-pre-wrap ">{description}</div>
    </div>
  );
};

const TIP_BLOCKS = [
  {
    title: 'Recovery signatures',
    description: 'Minimum required was set by account owner',
    icon: <Search />,
  },
  {
    title: 'Begin recovery and wait 48 hrs',
    description: 'The 48 hours is needed for security reasons',
    icon: <Shield />,
  },
  {
    title: 'Complete recovery ',
    description: 'Regain access once recovery is completed',
    icon: <Clock />,
  },
];

export default function Home() {
  const { recoveryRecord, loading } = useRecoveryRecord();

  if (loading) {
    return (
      <div className="my-auto flex flex-col items-center justify-center gap-y-sm">
        <div className="bg-blue rounded-pill p-md">
          <LoaderCircle
            className="size-12 animate-spin"
            stroke="#fff"
            strokeOpacity={0.9}
          />
        </div>
        <div className="text-bold-body">Fetching recovery details...</div>
      </div>
    );
  }

  if (!recoveryRecord) {
    return notFound();
  }

  if (recoveryRecord?.status === TRecoveryStatus.WAITING_FOR_SIGNATURE) {
    return (
      <ContentWrapper title="Account recovery for">
        <div className="flex flex-col gap-xl items-center">
          <AddressWithChain
            className="bg-gray-150 w-fit "
            address={recoveryRecord?.address}
            chainID={Number(recoveryRecord?.chainID)}
          />

          <div className="flex flex-row gap-x-2 flex-nowrap justify-between p-xl rounded-lg bg-gray-150">
            {TIP_BLOCKS.map((tip) => (
              <TipBlock key={tip.title} {...tip} />
            ))}
          </div>

          <Button>
            <Link href="/contacts">Recovery status</Link>
          </Button>
        </div>
      </ContentWrapper>
    );
  }

  if (
    recoveryRecord?.status === TRecoveryStatus.RECOVERY_COMPLETED ||
    recoveryRecord?.status === TRecoveryStatus.RECOVERY_CANCELED
  ) {
    redirect('/finished');
  }

  // TODO: replace this <ProcessingTip/> once the component has been extracted to shared-components project
  return (
    <ContentWrapper>
      <div className="flex flex-col items-center gap-y-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M49.6667 91.3333C72.6785 91.3333 91.3333 72.6785 91.3333 49.6667C91.3333 26.6548 72.6785 8 49.6667 8C26.6548 8 8 26.6548 8 49.6667C8 72.6785 26.6548 91.3333 49.6667 91.3333Z"
            fill="#234759"
          />
          <path
            d="M32 50L44 62L68 38"
            stroke="#CEF2B9"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="flex flex-col items-center gap-y-sm text-center">
          <h1 className="text-title">Recovery already in progress</h1>
          <p className="text-smaller text-gray-600">
            Other contacts are assisting your friend with account recovery.
            <br />
            No further action required.
          </p>
        </div>

        <Button size="lg">
          <Link href="/start">Recovery status</Link>
        </Button>
      </div>
    </ContentWrapper>
  );
}
