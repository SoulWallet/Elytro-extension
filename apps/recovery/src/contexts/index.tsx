'use client';

import { toast } from '@/hooks/use-toast';
import { query } from '@/requests/client';
import { QUERY_GET_RECOVERY_INFO } from '@/requests/gqls';
import { useSearchParams } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface IRecoveryRecordContext {
  loading: boolean;
  recoveryRecord: TRecoveryInfo | null;
  getRecoveryRecord: () => void;
}

const RecoveryRecordContext = createContext<IRecoveryRecordContext | undefined>(
  undefined
);

export const RecoveryRecordProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [recoveryRecord, setRecoveryRecord] = useState<TRecoveryInfo | null>(
    null
  );

  const recoveryRecordId = useSearchParams().get('id');

  const getRecoveryRecord = async () => {
    try {
      setLoading(true);
      const res = await query(QUERY_GET_RECOVERY_INFO, {
        recoveryRecordId,
      });
      setRecoveryRecord((res as SafeAny)?.getRecoveryInfo as TRecoveryInfo);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Get Recovery Record Failed',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recoveryRecordId) {
      getRecoveryRecord();
    }
  }, [recoveryRecordId]);

  return (
    <RecoveryRecordContext.Provider
      value={{ recoveryRecord, getRecoveryRecord, loading }}
    >
      {children}
    </RecoveryRecordContext.Provider>
  );
};

export const useRecoveryRecord = () => {
  const context = useContext(RecoveryRecordContext);
  if (context === undefined) {
    throw new Error(
      'useRecoveryRecord must be used within a RecoveryRecordProvider'
    );
  }
  return context;
};
