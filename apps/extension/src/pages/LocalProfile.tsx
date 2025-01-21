import { useState } from 'react';
import ChangePasswordModal from '@/components/biz/ChangePasswordModal';
import SecondaryPageWrapper from '@/components/biz/SecondaryPageWrapper';
import AutoLockTimerModal from '@/components/biz/AutoLockTimer';

export default function LocalProfile() {
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openAutoLockTimerModal, setOpenAutoLockTimerModal] = useState(false);
  return (
    <SecondaryPageWrapper title="Local Profile">
      <div className="space-y-2">
        <div
          className="elytro-rounded-border-item-wrapper hover:bg-gray-150"
          onClick={() => setOpenChangePasswordModal(true)}
        >
          Change password
        </div>
        <div
          className="elytro-rounded-border-item-wrapper hover:bg-gray-150"
          onClick={() => setOpenAutoLockTimerModal(true)}
        >
          Auto lock timer
        </div>
      </div>
      {openChangePasswordModal && (
        <ChangePasswordModal
          open={openChangePasswordModal}
          handleOnOpenChange={() => setOpenChangePasswordModal(false)}
        />
      )}
      {openAutoLockTimerModal && (
        <AutoLockTimerModal
          open={openAutoLockTimerModal}
          handleOnOpenChange={() => setOpenAutoLockTimerModal(false)}
        />
      )}
    </SecondaryPageWrapper>
  );
}
