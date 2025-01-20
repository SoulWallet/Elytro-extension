import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Ellipsis,
  RefreshCcw,
} from 'lucide-react';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { navigateTo } from '@/utils/navigation';
import ActionButton from './ActionButton';
import ActivateButton from './ActivateButton';
import { useAccount } from '@/contexts/account-context';
import { useChain } from '@/contexts/chain-context';
import AccountsDropdown from './AccountsDropdown';
import { safeClipboard } from '@/utils/clipboard';
import { useEffect } from 'react';

export default function BasicAccountInfo() {
  const {
    accountInfo,
    updateTokens,
    updateAccount,
    getAccounts,
    updateHistory,
  } = useAccount();
  const { getCurrentChain } = useChain();

  const onClickMore = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Settings);
  };

  const onClickSend = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.SendTx);
  };

  const onClickReceive = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Receive);
  };

  const reloadAccount = async () => {
    await getCurrentChain();
    await getAccounts();
    await updateAccount();
    await updateTokens();
    await updateHistory();
  };

  useEffect(() => {
    reloadAccount();
  }, []);

  return (
    <div className="flex flex-col p-sm pb-0 ">
      {/* Chain & Address */}
      <div className="flex flex-row gap-2 w-full items-center justify-between mb-lg">
        <AccountsDropdown />
        <div className="flex flex-row gap-x-md">
          <Copy
            className="elytro-clickable-icon"
            onClick={() => safeClipboard(accountInfo.address)}
          />
          <RefreshCcw
            className="elytro-clickable-icon"
            onClick={reloadAccount}
          />
          <Ellipsis className="elytro-clickable-icon" onClick={onClickMore} />
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
                icon={<ArrowDownLeft className="w-5 h-5" />}
                label="Receive"
                onClick={onClickReceive}
              />
              <ActionButton
                icon={<ArrowUpRight className="w-5 h-5" />}
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
