import { createContext, useContext, useEffect, useState } from 'react';
import {
  WalletController,
  WalletStatusEn,
} from '@/background/walletController';
import PortMessage from '@/utils/message/portMessage';
import { toast } from '@/hooks/use-toast';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { navigateTo } from '@/utils/navigation';

const portMessage = new PortMessage('elytro-ui');

const walletControllerProxy = new Proxy(
  {},
  {
    get(_, prop: keyof WalletController) {
      return function (...args: unknown[]) {
        portMessage.sendMessage('UI_REQUEST', {
          method: prop,
          params: args,
        });

        return new Promise((resolve, reject) => {
          portMessage.onMessage(`UI_RESPONSE_${prop}`, (data) => {
            if (data?.error) {
              reject(data?.error);
            } else {
              resolve(data?.result);
            }
          });
        });
      };
    },
  }
) as WalletController;

type IWalletContext = {
  wallet: WalletController;
  status: WalletStatusEn;
  getWalletStatus: () => Promise<void>;
};

const WalletContext = createContext<IWalletContext>({
  wallet: walletControllerProxy as WalletController,
  status: WalletStatusEn.NoOwner,
  getWalletStatus: async () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<WalletStatusEn>(WalletStatusEn.NoOwner);
  const [loading, setLoading] = useState(false);

  const getWalletStatus = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await walletControllerProxy.getWalletStatus();

      if (res !== WalletStatusEn.HasAccountAndUnlocked) {
        navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);
      }
      setStatus(res);
    } catch {
      toast({
        title: 'Failed to get wallet status',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setStatus(WalletStatusEn.NoOwner);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWalletStatus();
  }, [walletControllerProxy]);

  return (
    <WalletContext.Provider
      value={{ wallet: walletControllerProxy, status, getWalletStatus }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }

  return context;
};
