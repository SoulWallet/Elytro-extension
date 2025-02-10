import React from 'react';
import IconSuccess from '@/assets/icons/success.png';
import FullPageWrapper from '@/components/biz/FullPageWrapper';
import { navigateTo } from '@/utils/navigation';
import { SIDE_PANEL_ROUTE_PATHS } from '@/routes';
import { Button } from '@/components/ui/button';

const YouAreIn: React.FC = () => {
  const handleGotoCreateAccount = async () => {
    navigateTo('side-panel', SIDE_PANEL_ROUTE_PATHS.CreateAccount);
  };

  return (
    <FullPageWrapper
      className="elytro-gradient-bg"
      // TODO: full page layout without title.
      title="&nbsp;"
      showBack={false}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <img src={IconSuccess} alt="Passcode" width={100} />
        </div>
        <h1 className="elytro-text-title text-center">You are in!</h1>
        <h2 className="text-sm text-muted-foreground text-center">
          Now you can create your first smart account
        </h2>
        <Button
          type="submit"
          className="w-full rounded-full h-14"
          size="large"
          onClick={handleGotoCreateAccount}
        >
          Create account
        </Button>
      </div>
    </FullPageWrapper>
  );
};

export default YouAreIn;
