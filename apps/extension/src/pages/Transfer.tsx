import WalletImg from '@/assets/wallet.png';
import { Button } from '@/components/ui/button';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { navigateTo } from '@/utils/navigation';
import { toast } from '@/hooks/use-toast';
import FullPageWrapper from '@/components/biz/FullPageWrapper';

export default function Transfer() {
  return (
    <FullPageWrapper>
      <img src={WalletImg} alt="Wallet" className="size-[144px]" />
      <div className="text-center flex flex-col gap-y-2xs">
        <h1 className="elytro-text-subtitle">
          Manage your smart contract accounts
        </h1>
        <p className="elytro-text-smaller-body text-gray-600">
          We don’t manage externally owned accounts (EOAs)
        </p>
      </div>
      <div className="flex flex-col gap-y-md w-full">
        <Button
          onClick={() =>
            toast({
              title: 'Import feature is not available yet',
              description: 'Please wait for the update',
            })
          }
        >
          Import an account
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.CreatePasscode, {
              from: 'recover',
            });
          }}
        >
          Recover an account
        </Button>
      </div>
    </FullPageWrapper>
  );
}
