'use client';

import { useRecoveryRecord } from '@/contexts';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function LogoHeader() {
  const searchParams = useSearchParams();
  const { recoveryRecord } = useRecoveryRecord();

  const id = recoveryRecord
    ? recoveryRecord.recoveryRecordID
    : searchParams.get('id');

  return (
    <Link href={`/?id=${id}`} className="flex flex-row items-center gap-2">
      <Image
        className="dark:invert"
        src="/logo.svg"
        alt="Elytro"
        width={20}
        height={20}
        priority
      />
      <span className="text-title">Elytro</span>
    </Link>
  );
}
