import { useEffect } from 'react';
import {
  HistoricalActivityTypeEn,
  UserOperationHistory,
} from '@/constants/operations';
import { UserOperationStatusEn } from '@/constants/operations';
import { useState } from 'react';
import { EVENT_TYPES } from '@/constants/events';
import RuntimeMessage from '@/utils/message/runtimeMessage';
import { formatEther } from 'viem';
import { formatAddressToShort } from '@/utils/format';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronsLeftRight,
  Activity,
  ShieldQuestion,
} from 'lucide-react';
import { useChain } from '@/contexts/chain-context';
import { useAccount } from '@/contexts/account-context';
const ActivityTypeMap = {
  [HistoricalActivityTypeEn.Send]: {
    name: 'Send',
    IconComponent: ArrowUpRight,
    bg: 'bg-light-blue',
  },
  [HistoricalActivityTypeEn.Receive]: {
    name: 'Receive',
    IconComponent: ArrowDownLeft,
    bg: 'bg-light-green',
  },
  [HistoricalActivityTypeEn.ActivateAccount]: {
    name: 'Activate Account',
    IconComponent: Activity,
    bg: 'bg-green',
  },
  [HistoricalActivityTypeEn.ContractInteraction]: {
    name: 'Contract Interaction',
    IconComponent: ChevronsLeftRight,
    bg: 'bg-light-red',
  },
};

const UnknownActivity = {
  name: 'Unknown Activity',
  IconComponent: ShieldQuestion,
  bg: 'bg-gray-200',
};

const ActivityStatusMap = {
  [UserOperationStatusEn.confirmedSuccess]: {
    label: 'Success',
    style: 'hidden',
  },
  [UserOperationStatusEn.confirmedFailed]: {
    label: 'Failed',
    style: 'bg-red',
  },
  [UserOperationStatusEn.pending]: {
    label: 'Pending',
    style: 'bg-blue',
  },
};

export default function ActivityItem({
  opHash,
  status = UserOperationStatusEn.pending,
  to,
  value,
  type,
}: UserOperationHistory) {
  const { updateTokens } = useAccount();
  const { openExplorer } = useChain();
  const [latestStatus, setLatestStatus] = useState(status);

  const updateStatusFromMessage = (response: SafeObject) => {
    setLatestStatus(response?.status || UserOperationStatusEn.pending);
    updateTokens();
  };

  useEffect(() => {
    RuntimeMessage.onMessage(
      `${EVENT_TYPES.HISTORY.ITEM_STATUS_UPDATED}_${opHash}`,
      updateStatusFromMessage
    );

    return () => {
      RuntimeMessage.offMessage(updateStatusFromMessage);
    };
  }, [opHash]);

  const { name, IconComponent, bg } = type
    ? ActivityTypeMap[type]
    : UnknownActivity;
  const { label, style } = ActivityStatusMap[latestStatus];

  return (
    <div
      className="flex items-center justify-between cursor-pointer py-md"
      onClick={() => openExplorer(opHash)}
    >
      <div className="flex items-center gap-4">
        <IconComponent className={`size-8 p-1 ${bg} rounded-full`} />

        <div className="flex flex-col">
          <span className="text-sm font-medium elytro-text-smaller-bold-body">
            {name}
            <span
              className={`elytro-text-tiny-body px-1 rounded-sm ml-sm text-white ${style} `}
            >
              {label}
            </span>
          </span>

          <span className="elytro-text-tiny-body text-gray-600">
            To {formatAddressToShort(to)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="elytro-text-smaller-bold-body">
          {/* TODO: history need currency info */}
          {formatEther(BigInt(value))} ETH
        </span>
      </div>
    </div>
  );
}
