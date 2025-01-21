import { getIconByChainId } from '@/constants/chains';
import { formatAddressToShort } from '@/utils/format';
import { cn } from '@/utils/shadcn/utils';

interface IProps {
  address: string;
  chainId?: number;
  className?: string;
}

export default function ShortedAddress({
  address,
  chainId,
  className,
}: IProps) {
  return (
    <span
      className={cn(
        'w-fit flex flex-row items-center gap-x-sm p-xs rounded-2xs bg-gray-150',
        className
      )}
    >
      <img src={getIconByChainId(chainId)} className="size-4 rounded-full" />
      <span className="elytro-text-tiny-body text-gray-750">
        {formatAddressToShort(address)}
      </span>
    </span>
  );
}
