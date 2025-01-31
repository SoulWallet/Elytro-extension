import passwordIcon from '@/assets/password.png';
import { PasswordSetter } from '@/components/ui/PasswordSetter';
import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { navigateTo } from '@/utils/navigation';
import { useState } from 'react';

export default function CreatePassword() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleCreatePassword = async (password: string) => {
    try {
      setLoading(true);
      await wallet.createNewOwner(password);
      navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.Home);
    } catch {
      toast({
        title: 'Failed to create password',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="elytro-gradient-bg flex flex-1 flex-col items-center justify-center px-3xl h-full gap-y-3xl">
      <img src={passwordIcon} alt="Password" className="size-[164px] p-xl" />
      <div className="flex flex-col gap-y-md text-center">
        <h1 className="text-title">Create a passcode</h1>
        <p className="text-smaller text-gray-600">
          This is for accessing your accounts on this device
        </p>
      </div>
      <PasswordSetter onSubmit={handleCreatePassword} loading={loading} />
    </div>
  );
}
