import SecondaryPageWrapper from '@/components/biz/SecondaryPageWrapper';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { useChain } from '@/contexts/chain-context';
import ChainItem from '@/components/ui/ChainItem';
import { TChainItem } from '@/constants/chains';
import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';

interface IChainGroupProps {
  chains: TChainItem[];
  title: string;
  selectedChainId: number | null;
  onSelect: (id: number) => void;
}

const ChainGroup = ({
  chains,
  title,
  selectedChainId,
  onSelect,
}: IChainGroupProps) => {
  return (
    <div className="flex flex-col gap-y-sm">
      <h2 className="text-body-bold text-gray-600">{title}</h2>
      {chains.map((chain) => (
        <ChainItem
          key={chain.id}
          chain={chain}
          onClick={() => onSelect(chain.id)}
          isSelected={selectedChainId === chain.id}
        />
      ))}
    </div>
  );
};

// TODO: render different UI based on URL params
export default function SelectChain() {
  const { wallet } = useWallet();
  const { chains } = useChain();
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  const { mainnet, testnet } = useMemo(() => {
    const mainnet = chains.filter((chain) => !chain.testnet);
    const testnet = chains.filter((chain) => chain.testnet);
    return { mainnet, testnet };
  }, [chains]);

  const handleCreateAccount = async () => {
    try {
      await wallet.createAccount(selectedChain!);
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Dashboard);
    } catch (error) {
      toast({
        title: 'Failed to create account',
        description: (error as Error).message ?? 'Unknown error',
      });
    }
  };

  const handleSelectChain = (id: number) => {
    setSelectedChain(id);
  };

  return (
    <SecondaryPageWrapper
      title="Create Account"
      showBack={false}
      footer={
        <Button
          className="w-full"
          onClick={handleCreateAccount}
          disabled={!selectedChain}
        >
          Create
        </Button>
      }
    >
      <div className="flex flex-col gap-y-2xl">
        <h1 className="text-body-bold">Set a network</h1>

        <ChainGroup
          chains={mainnet}
          title="Mainnet"
          selectedChainId={selectedChain}
          onSelect={handleSelectChain}
        />

        <ChainGroup
          chains={testnet}
          title="Testnet"
          selectedChainId={selectedChain}
          onSelect={handleSelectChain}
        />
      </div>
    </SecondaryPageWrapper>
  );
}
