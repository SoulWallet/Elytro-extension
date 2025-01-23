'use client';

import { query } from '@/requests/client';
import { QUERY_GET_RECOVERY_INFO } from '@/requests/gqls';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const recoveryRecordId = searchParams.get('id');

  const { data, isLoading } = useQuery({
    queryKey: ['record'],
    queryFn: () => {
      return query(QUERY_GET_RECOVERY_INFO, {
        recoveryRecordId,
      });
    },
    enabled: !!recoveryRecordId,
  });

  const getRecoveryInfo = (data as SafeAny)?.getRecoveryInfo as
    | TRecoveryInfo
    | undefined;

  console.log(getRecoveryInfo);

  if (!isLoading) {
    // TODO: replace this <ProcessingTip/> once the component has been extracted to shared-components project
    return (
      <div className="flex flex-col items-center justify-center gap-y-sm py-2xl">
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

  return (
    <div>
      {getRecoveryInfo?.status}
      {getRecoveryInfo?.guardianInfo?.guardians}
    </div>
  );
}
