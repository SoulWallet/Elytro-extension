import {
  ArrowDownLeft,
  ArrowUpRight,
  Ellipsis,
  RefreshCcw,
} from 'lucide-react';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { navigateTo } from '@/utils/navigation';
import ActionButton from './ActionButton';
import ActivateButton from './ActivateButton';
import { useAccount } from '@/contexts/account-context';
import { useChain } from '@/contexts/chain-context';
import Spin from '@/components/ui/Spin';
import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';
import AccountsDropdown from './AccountsDropdown';

export default function BasicAccountInfo() {
  const {
    accountInfo,
    accounts,
    updateTokens,
    updateAccount,
    getAccounts,
    updateHistory,
  } = useAccount();
  const { wallet } = useWallet();
  const { currentChain, getCurrentChain } = useChain();

  const onClickMore = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Settings);
  };

  const onClickSend = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.SendTx);
  };

  const onClickReceive = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Receive);
  };

  if (!currentChain || !accountInfo) {
    return <Spin isLoading />;
  }

  // const { integerPart, decimalPart } = formatBalance(balance, {
  //   threshold: 0.001,
  //   maxDecimalLength: 8,
  // });

  const reloadAccount = async () => {
    await getCurrentChain();
    await getAccounts();
    await updateAccount();
    await updateTokens();
    await updateHistory();
  };

  const handleAddAccount = async () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.CreateNewAddress);
  };

  const handleSelectAccount = async (account: TAccountInfo) => {
    try {
      await wallet.switchAccountByChain(account.chainId);

      await reloadAccount();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to switch account',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveAccount = async (account: TAccountInfo) => {
    try {
      await wallet.removeAccount(account.address);
      await reloadAccount();
      toast({
        title: 'Account removed successfully',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to delete account',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col p-sm pb-0 ">
      {/* Chain & Address */}
      <div className="flex flex-row gap-2 w-full items-center justify-between mb-lg">
        <AccountsDropdown
          accounts={accounts}
          currentAccount={accountInfo}
          onAddAccount={handleAddAccount}
          onSwitchAccount={handleSelectAccount}
          onRemoveAccount={handleRemoveAccount}
        />
        <div className="flex flex-row gap-lg">
          <Ellipsis className="elytro-clickable-icon" onClick={onClickMore} />
          <RefreshCcw
            className="elytro-clickable-icon"
            onClick={reloadAccount}
          />
        </div>
      </div>

      {/* TODO: NOT SHOW BALANCE FOR NOW */}
      {/* Balance: $XX.xx */}
      {/* <div className="my-sm py-1 elytro-text-hero">
        <span>{integerPart}</span>
        <span className=" text-gray-450">.{decimalPart}</span> ETH
      </div> */}

      {/* Actions */}
      <div>
        <div className="flex flex-row gap-sm">
          {accountInfo.isDeployed ? (
            <>
              <ActionButton
                className="bg-light-green"
                icon={<ArrowDownLeft />}
                label="Receive"
                onClick={onClickReceive}
              />
              <ActionButton
                icon={<ArrowUpRight />}
                label="Send"
                onClick={onClickSend}
              />
            </>
          ) : (
            <ActivateButton />
          )}
        </div>
      </div>
    </div>
  );
}
