import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAccount } from '../contexts/account-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useWallet } from '@/contexts/wallet';

interface IProps {
  open: boolean;
  onOpenChange: () => void;
}

export default function AccountsModal({ open, onOpenChange }: IProps) {
  const { chains, accounts, currentChain } = useAccount();
  const wallet = useWallet();
  const [networkId, setNetworkId] = useState<string>('');
  const handleAdd = async () => {
    try {
      if (networkId) {
        await wallet.createNewSmartAccount(Number(networkId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitch = async (networkId: string | number) => {
    await wallet.switchNetwork(networkId.toString());
  };
  if (chains.length === 0) return;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen">
        <div className="mt-10">
          <h3 className="text-3xl mb-10">Accounts</h3>
          {accounts.map((account, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                {chains.find((chain) => chain.id === account.networkId)?.name ||
                  'Unknown Network'}
              </div>
              {account.address && <div>{account.address}</div>}
              <div>{account.isActivated ? 'Activated' : 'Not Activated'}</div>
              {account.networkId !== currentChain?.id && (
                <Button onClick={() => handleSwitch(account.networkId)}>
                  Switch
                </Button>
              )}
            </div>
          ))}

          <div>
            <h3 className=" font-bold text-2xl">Add Account</h3>
            <div>
              <Select
                value={networkId}
                onValueChange={(val) => setNetworkId(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="select network" />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAdd}>Add</Button>
            </div>
          </div>
          {currentChain ? (
            <div className="text-3xl">currentChain: {currentChain.name}</div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
