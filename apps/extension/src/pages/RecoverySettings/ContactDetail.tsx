import AddressInputWithChainIcon from '@/components/ui/AddressInputer';
import { Button } from '@/components/ui/button';
import HelperText from '@/components/ui/HelperText';
import { Input } from '@/components/ui/input';
import { useAccount } from '@/contexts/account-context';
import React, { useState } from 'react';
import { isAddress } from 'viem';

interface IContactDetailProps {
  contact: TRecoveryContact | null;
  onSaveContact: (contact: TRecoveryContact) => void;
}

export default function ContactDetail({
  contact,
  onSaveContact,
}: IContactDetailProps) {
  const { accountInfo: currentAccount } = useAccount();
  const [address, setAddress] = useState<string>(contact?.address || '');
  const [name, setName] = useState<string>(contact?.name || '');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="flex flex-col h-full justify-between ">
      <div className=" flex flex-col gap-y-md">
        <h1 className="text-body-bold my-1">
          {contact ? 'Edit' : 'Add'} a recovery contact
        </h1>

        {/* TODO: Missing Tab: Which type of contact? Email or Wallet Address */}

        <HelperText
          title="Name of contact is saved locally"
          description="Name of your recovery contact will not be deployed on chain for privacy reasons."
        />

        {/* If Wallet Address: input address and name(optional) */}
        <AddressInputWithChainIcon
          chainId={currentAccount.chainId}
          address={address}
          onChange={setAddress}
        />

        <Input
          placeholder="Name of contact (optional)"
          value={name}
          className="w-full bg-gray-150 rounded-md px-lg py-2xl border-none "
          onChange={handleNameChange}
        />
      </div>

      <Button
        disabled={!isAddress(address)}
        onClick={() => onSaveContact({ address, name })}
      >
        Continue
      </Button>
    </div>
  );
}
