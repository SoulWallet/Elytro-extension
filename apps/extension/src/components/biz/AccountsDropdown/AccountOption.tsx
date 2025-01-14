import { useAlert } from '@/components/ui/alerter';
import { getIconByChainId } from '@/constants/chains';
import { toast } from '@/hooks/use-toast';
import { formatAddressToShort, formatTokenAmount } from '@/utils/format';
import { cn } from '@/utils/shadcn/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Trash } from 'lucide-react';

interface IAccountOptionProps {
  account: TAccountInfo;
  isSelected: boolean;
  onDelete: () => void;
  onSelect: () => void;
}

export default function AccountOption({
  account,
  isSelected,
  onDelete,
  onSelect,
}: IAccountOptionProps) {
  const { elytroAlert } = useAlert();

  const handleDelete = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();

    if (isSelected) {
      toast({
        title: 'Cannot delete current account',
        description: 'Please switch to another account',
        variant: 'destructive',
      });
      return;
    }

    elytroAlert({
      title: 'Delete from this device',
      description:
        'The account is still functional but is no longer accessible from this device. You can add it back any time.',
      onConfirm: onDelete,
    });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-x-xl justify-between px-lg py-sm hover:bg-gray-100',
        isSelected && 'bg-gray-200'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-sm">
        <Avatar>
          <AvatarImage
            className="size-8"
            src={getIconByChainId(account.chainId)}
          />
          <AvatarFallback>{account.chainId}</AvatarFallback>
        </Avatar>

        <span>{formatAddressToShort(account.address)}</span>
      </div>

      <div className="elytro-text-small-body text-gray-600 flex flex-row items-center gap-sm">
        <span>{formatTokenAmount(account.balance)}</span>
        <Trash className="size-3" onClick={handleDelete} />
      </div>
    </div>
  );
}
