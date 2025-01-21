import SecondaryPageWrapper from '@/components/biz/SecondaryPageWrapper';
import AddressInputWithChainIcon from '@/components/ui/AddressInputer';
import { useWallet } from '@/contexts/wallet';
import { Button } from '@/components/ui/button';
import { useChain } from '@/contexts/chain-context';
import { navigateTo } from '@/utils/navigation';
import { Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';

export default function AccountRecovery() {
  const [address, setAddress] = useState('');
  const { currentChain } = useChain();
  const { wallet } = useWallet();

  const handleRetrieveContacts = () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.RetrieveContacts, {
      address,
    });
  };

  // TODO: check this logic
  useEffect(() => {
    wallet.localRecoveryAddress().then((address) => {
      if (address) {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.RetrieveContacts, {
          address,
        });
      }
    });
  }, [wallet]);

  return (
    <SecondaryPageWrapper
      title="Recovery"
      closeable
      footer={
        <Button
          className="w-full"
          disabled={!isAddress(address)}
          onClick={handleRetrieveContacts}
        >
          <Box className="size-2xl mr-sm" color="#cce1ea" />
          Retrieve my contacts
        </Button>
      }
    >
      <div className="flex flex-col gap-y-sm mb-md">
        <h1 className="elytro-text-bold-body">Account Address</h1>
        <p className="elytro-text-smaller-body text-gray-600">
          Enter your account address for us to retrieve your recovery contacts
        </p>
      </div>

      <AddressInputWithChainIcon
        chainId={currentChain?.id || 0}
        address={address}
        onChange={setAddress}
      />
    </SecondaryPageWrapper>
  );
}
