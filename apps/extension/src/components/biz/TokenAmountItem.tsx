import { formatTokenAmount } from '@/utils/format';
import { cn } from '@/utils/shadcn/utils';
import { TokenInfo } from '@soulwallet/decoder';

interface ITokenAmountItemProps
  extends Partial<Pick<TokenInfo, 'logoURI' | 'symbol' | 'decimals'>> {
  value?: string;
  className?: string;
}

export default function TokenAmountItem({
  logoURI,
  symbol,
  decimals,
  value,
  className,
}: ITokenAmountItemProps) {
  if (!value) return '--';

  return (
    <span
      className={cn(
        'flex items-center gap-x-sm elytro-text-bold-body',
        className
      )}
    >
      {/* TODO: no fromInfo. no logo & name */}
      <img
        className="size-6 rounded-full ring-1 ring-gray-150"
        src={logoURI}
        alt={symbol}
      />
      <span>{formatTokenAmount(value, decimals, symbol)}</span>
    </span>
  );
}
