import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SUPPORTED_CHAINS } from '@/constants/chains';
import { cn } from '@/utils/shadcn/utils';
import { isAddress } from 'viem';

interface IProps {
  address?: string;
  chainId?: number;
  className?: string;
  size?: keyof typeof SIZE_MAP;
  dotColor?: string;
}

const SIZE_MAP = {
  sm: {
    icon: 'size-4',
    text: 'elytro-text-small-body',
  },
  md: {
    icon: 'size-8',
    text: 'text-body-bold',
  },
};

export default function FragmentedAddress({
  address,
  chainId,
  size = 'sm',
  className,
  dotColor,
}: IProps) {
  if (!address || !isAddress(address)) {
    return '--';
  }

  const prefix = address.slice(0, 6);
  const suffix = address.slice(-6);
  const { icon, text } = SIZE_MAP[size];
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);

  return (
    <div className={cn('flex items-center gap-sm', className)}>
      {chain && <img src={chain.icon} alt={chain.name} className={icon} />}
      <div className={cn('flex items-center gap-sm', text)}>
        <span>{prefix}</span>
        <Tooltip>
          <TooltipTrigger>
            <span
              className="px-1 bg-gray-300 rounded-xs"
              style={{ backgroundColor: dotColor }}
            >
              …
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-dark-blue p-4 ">
            <div className="text-blue">
              <span className="text-light-blue">{prefix}</span>
              {address.slice(6, -6)}
              <span className="text-light-blue">{suffix}</span>
            </div>
          </TooltipContent>
        </Tooltip>
        <span>{suffix}</span>
      </div>
    </div>
  );
}
