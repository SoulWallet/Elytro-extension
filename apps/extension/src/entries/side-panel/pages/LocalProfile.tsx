import { useState } from 'react';
import ChangePasswordModal from '../components/ChangePasswordModal';
import SecondaryPageWrapper from '../components/SecondaryPageWrapper';

export default function LocalProfile() {
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  return (
    <SecondaryPageWrapper title="Local Profile">
      <div className="space-y-2">
        <div
          className="elytro-setting-item"
          onClick={() => setOpenChangePasswordModal(true)}
        >
          Change password
        </div>
        <div className="elytro-setting-item">Auto lock timer</div>
      </div>
      {openChangePasswordModal && (
        <ChangePasswordModal
          open={openChangePasswordModal}
          handleOnOpenChange={() => setOpenChangePasswordModal(false)}
        />
      )}
    </SecondaryPageWrapper>
  );
}
