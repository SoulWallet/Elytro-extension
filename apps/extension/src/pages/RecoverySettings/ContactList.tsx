import ContactItem from '@/components/biz/ContactItem';
import { Button } from '@/components/ui/button';
import HelperText from '@/components/ui/HelperText';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAccount } from '@/contexts/account-context';
import { useTx } from '@/contexts/tx-context';
import { UserOpType } from '@/contexts/tx-context';
import { useWallet } from '@/contexts/wallet';
import { toast } from '@/hooks/use-toast';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import ContactsImg from '@/assets/contacts.png';
import ShortedAddress from '@/components/ui/ShortedAddress';

interface IContactListProps {
  contacts: TRecoveryContact[];
  threshold: number;
  onAddContact: () => void;
  onEditContact: (contact: TRecoveryContact) => void;
  onDeleteContact: (contact: TRecoveryContact) => void;
}

export default function ContactList({
  contacts,
  threshold,
  onAddContact,
  onEditContact,
  onDeleteContact,
}: IContactListProps) {
  const { accountInfo: currentAccount } = useAccount();
  const { wallet } = useWallet();
  const { openUserOpConfirmTx } = useTx();
  const [loading, setLoading] = useState(false);
  const [myThreshold, setMyThreshold] = useState<string>(threshold.toString());

  const isEmptyContacts = contacts.length === 0;

  const handleConfirmContacts = async () => {
    try {
      setLoading(true);

      const txs = await wallet.generateRecoveryContactsSettingTxs(
        contacts.map((contact) => contact.address),
        Number(myThreshold)
      );

      openUserOpConfirmTx(UserOpType.SendTransaction, txs);
    } catch (error) {
      toast({
        title: 'Confirm contacts failed',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-y-md">
        <h1 className="elytro-text-body-bold">Your recovery contacts</h1>

        {/* Operation Bar */}
        <div className="flex flex-row justify-between">
          <ShortedAddress
            address={currentAccount.address}
            chainId={currentAccount.chainId}
          />

          {isEmptyContacts ? null : (
            <Button variant="secondary" size="tiny" onClick={onAddContact}>
              <Plus className="size-lg" />
              Add
            </Button>
          )}
        </div>

        <HelperText
          title="How does it work?"
          description="Add 2–3 recovery social contacts via email or wallet address, so they can help you regain access later."
        />

        {contacts?.length ? (
          <div className="flex flex-col gap-y-sm">
            {contacts.map((contact) => (
              <ContactItem
                key={contact.address}
                contact={contact}
                rightContent={
                  <div className="flex items-center gap-x-sm flex-shrink-0">
                    <Edit
                      onClick={() => onEditContact(contact)}
                      className="size-2xl cursor-pointer"
                      color="#95979C"
                    />
                    <Trash
                      onClick={() => onDeleteContact(contact)}
                      className="size-2xl cursor-pointer"
                      color="#95979C"
                    />
                  </div>
                }
              />
            ))}

            <div>
              <h1 className="elytro-text-body-bold mb-2xs">
                Minimum confirmations required
              </h1>

              <p className="text-smaller text-gray-600 mb-md">
                How many recovery contacts are needed for your account recovery
              </p>

              <div className="flex flex-row gap-x-md items-center">
                <Select
                  value={Number(myThreshold) ? myThreshold : undefined}
                  onValueChange={setMyThreshold}
                >
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="elytro-select-content">
                    {Array.from({ length: contacts.length }, (_, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="elytro-text-small-bold">
                  out of {contacts.length} contacts
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-md items-center mt-4xl">
            <img src={ContactsImg} className="size-36" />
            <span className="elytro-text-title">Add a new contact</span>

            <Button variant="secondary" size="small" onClick={onAddContact}>
              <Plus className="size-lg" />
              Add a new contact
            </Button>
          </div>
        )}
      </div>

      {/* Contact List */}

      <Button
        className="w-full"
        disabled={!contacts.length || loading || Number(myThreshold) < 1}
        onClick={handleConfirmContacts}
      >
        {loading ? 'Confirming...' : 'Confirm contacts'}
      </Button>
    </div>
  );
}
