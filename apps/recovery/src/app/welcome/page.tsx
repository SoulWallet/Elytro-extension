'use client';
import AddressWithChain from '@/components/AddressWithChain';
import ContentWrapper from '@/components/ContentWrapper';
import { Button } from '@/components/ui/button';
import { useRecoveryRecord } from '@/contexts';
import { Clock, Search, Shield } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

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

export default function Welcome() {
  const { recoveryRecord } = useRecoveryRecord();

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
