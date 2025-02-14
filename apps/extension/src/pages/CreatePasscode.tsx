import React, { useState } from 'react';
import { PasswordSetter } from '@/components/ui/PasswordSetter';
import IconPasscode from '@/assets/passcode.png';
import FullPageWrapper from '@/components/biz/FullPageWrapper';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/wallet';

const Create: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { wallet } = useWallet();

  const handleCreatePassword = async (pwd: string) => {
    console.log(pwd);
    try {
      setLoading(true);
      await wallet.createNewOwner(pwd);

      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.YouAreIn);
    } catch (error) {
      toast({
        title: 'Oops! Something went wrong. Try again later.',
        description: error?.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullPageWrapper
      className="elytro-gradient-bg"
      title="&nbsp;"
      showBack={true}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <img src={IconPasscode} alt="Passcode" width={144} />
        </div>
        <h1 className="elytro-text-title text-center">Create a passcode</h1>
        <h2 className="text-sm text-muted-foreground text-center">
          This is for access your accounts on this device
        </h2>
        <PasswordSetter
          onSubmit={(pwd) => handleCreatePassword(pwd)}
          loading={loading}
        />
      </div>
    </FullPageWrapper>
  );
};

export default Create;
