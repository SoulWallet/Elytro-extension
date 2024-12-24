import { useKeyring } from '@/contexts/keyring';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';
import { Button } from '@/components/ui/button';
import { SIDE_PANEL_ROUTE_PATHS } from '../routes';
import { navigateTo, SidePanelRoutePath } from '@/utils/navigation';

export default function Settings() {
  const { lock } = useKeyring();
  const handleLock = async () => {
    await lock();
  };

  const handleJumpPage = (path: SidePanelRoutePath) => {
    navigateTo('side-panel', path);
  };
  return (
    <SecondaryPageWrapper
      title="Settings"
      footer={
        <div className="flex flex-col space-y-2 w-full">
          <Button variant="secondary" onClick={handleLock}>
            Lock Elytro
          </Button>
          <Button variant="outline">FAQ</Button>
          <div className="text-center text-gray-750">
            <p>Join Telegram group</p>
            <p>Version 1.00. Third party software licenses</p>
          </div>
        </div>
      }
    >
      <div className="bg-gray-150 p-lg rounded-lg space-y-2">
        <h2 className="text-base font-medium text-gray-600">
          Account settings
        </h2>
        <div className="space-y-2">
          <div className="elytro-setting-item">Social recovery</div>
          <div className="elytro-setting-item">Connected apps</div>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-gray-600 my-4">Elytro settings</h2>
        <div className="space-y-2">
          <div
            onClick={() => handleJumpPage(SIDE_PANEL_ROUTE_PATHS.LocalProfile)}
            className="elytro-setting-item"
          >
            Local Profile
          </div>
          <div className="elytro-setting-item">Network configuration</div>
        </div>
      </div>
    </SecondaryPageWrapper>
  );
}
