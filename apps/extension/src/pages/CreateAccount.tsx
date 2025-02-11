import React, { useEffect, useState } from 'react';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { Button } from '@/components/ui/button';
import SecondaryPageWrapper from '@/components/biz/SecondaryPageWrapper';
import ChainItem from '@/components/ui/ChainItem';
import { TChainItem } from '@/constants/chains';
import { toast } from '@/hooks/use-toast';
import { useChain } from '@/contexts/chain-context';
import { useWallet } from '@/contexts/wallet';

const CreateAccount: React.FC = () => {
  const { chains, getChains } = useChain();
  const { wallet } = useWallet();
  const [selectedChain, setSelectedChain] = useState<TChainItem | null>(null);

  useEffect(() => {
    console.log('Elytro::CreateAccountStep::getChains');

    getChains();
  }, []);

  const handleCreateAccount = async () => {
    if (!selectedChain) {
      toast({
        title: 'Please select a chain',
        description: 'Please select a chain to create your account',
      });
      return;
    }

    try {
      await wallet.createAccount(selectedChain.id);

      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
    } catch (error) {
      toast({
        title: 'Oops! Something went wrong. Try again later.',
        description: error?.toString(),
      });
    }
  };

  const handleSelectChain = (chain: TChainItem) => {
    setSelectedChain(chain);
  };

  return (
    <SecondaryPageWrapper
      title="Create account"
      footer={
        <Button
          type="submit"
          className="w-full rounded-full h-14"
          size="large"
          onClick={handleCreateAccount}
        >
          Create
        </Button>
      }
    >
      <div className="space-y-4">
        <h1 className="elytro-text-body font-bold">Set a network</h1>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="elytro-text-body font-bold text-gray-600 mt-4">
          Mainnet
        </div>
        <div className="grid grid-cols-1 gap-sm">
          {chains
            .filter((chain) => !chain.testnet)
            .map((chain) => (
              <ChainItem
                key={chain.id}
                chain={chain}
                isSelected={selectedChain?.id === chain.id}
                onClick={() => handleSelectChain(chain)}
              />
            ))}
        </div>

        <div className="elytro-text-body font-bold text-gray-600">Testnet</div>
        <div className="grid grid-cols-1 gap-sm">
          {chains
            .filter((chain) => chain.testnet)
            .map((chain) => (
              <ChainItem
                key={chain.id}
                chain={chain}
                isSelected={selectedChain?.id === chain.id}
                onClick={() => handleSelectChain(chain)}
              />
            ))}
        </div>
      </div>
    </SecondaryPageWrapper>
  );
};

export default CreateAccount;
