import { createContext, useContext } from 'react';
import { WalletController } from '@/background/walletController';
import PortMessage from '@/utils/message/portMessage';

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
};

const WalletContext = createContext<IWalletContext>({
  wallet: walletControllerProxy as WalletController,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContext.Provider value={{ wallet: walletControllerProxy }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const { wallet } = useContext(WalletContext);

  return wallet;
};
