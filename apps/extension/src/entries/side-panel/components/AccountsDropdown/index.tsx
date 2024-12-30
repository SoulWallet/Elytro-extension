import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AccountOption from './AccountOption';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getChainNameByChainId, getIconByChainId } from '@/constants/chains';
import { formatAddressToShort } from '@/utils/format';
import { useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { ChevronUp } from 'lucide-react';
import { safeClipboard } from '@/utils/clipboard';
import { Button } from '@/components/ui/button';
import { groupBy } from 'lodash';

interface IAccountsDropdownProps {
  accounts: TAccountInfo[];
  currentAccount: TAccountInfo;
  onAddAccount: () => void;
  onSwitchAccount: (account: TAccountInfo) => void;
  onRemoveAccount: (account: TAccountInfo) => void;
}

export default function AccountsDropdown({
  accounts,
  currentAccount,
  onAddAccount,
  onSwitchAccount,
  onRemoveAccount,
}: IAccountsDropdownProps) {
  const [open, setOpen] = useState(false);

  const ChevronIcon = open ? ChevronUp : ChevronDown;

  const handleCopyAddress = (e: React.MouseEvent<SVGSVGElement>) => {
    console.log('handleCopyAddress', e);
    e.stopPropagation();
    e.preventDefault();
    safeClipboard(currentAccount.address);
  };

  const accountGroupByChainId = groupBy(accounts, 'chainId');

  const handleSwitchAccount = (account: TAccountInfo) => {
    onSwitchAccount(account);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-x-sm border border-gray-200 rounded-[8px] bg-white px-sm py-xs text-gray-750">
          <DropdownMenuTrigger asChild>
            <Avatar className="size-4">
              <AvatarImage src={getIconByChainId(currentAccount.chainId)} />
              <AvatarFallback>{currentAccount.chainId}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <div className="flex items-center gap-x-sm">
            <span>{formatAddressToShort(currentAccount.address)}</span>
            <Copy className="size-3 z-50" onClick={handleCopyAddress} />
          </div>

          <ChevronIcon className="size-3" />
        </div>
      </div>
      <DropdownMenuContent
        side="bottom"
        align="start"
        alignOffset={-8}
        sideOffset={10}
        className="w-full max-w-fit bg-white rounded-md shadow-lg py-lg px-0"
      >
        <div className="flex items-center justify-between  gap-x-5xl px-lg pb-sm">
          <span className="elytro-text-bold-body text-gray-600">
            Switch account
          </span>
          <Button
            variant="outline"
            size="sm"
            className="elytro-text-tiny-body"
            onClick={onAddAccount}
          >
            Create new account
          </Button>
        </div>

        <div className="flex flex-col gap-y-sm">
          {Object.entries(accountGroupByChainId).map(([chainId, accounts]) => (
            <div key={chainId}>
              <div className="elytro-text-smaller-bold-body  text-gray-600 px-lg py-sm">
                {getChainNameByChainId(Number(chainId))}
              </div>
              {accounts.map((account) => (
                <AccountOption
                  key={account.address}
                  account={account}
                  isSelected={account.address === currentAccount.address}
                  onDelete={() => onRemoveAccount(account)}
                  onSelect={() => handleSwitchAccount(account)}
                />
              ))}
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
