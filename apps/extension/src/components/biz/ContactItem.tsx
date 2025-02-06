import { PencilLine, Trash2, UserRound } from 'lucide-react';

interface IContactItemProps {
  contact: TRecoveryContact;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContactItem({
  contact,
  onEdit,
  onDelete,
}: IContactItemProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-lg">
      <div className="flex items-center gap-x-sm flex-1 min-w-0">
        <UserRound className="size-2xl" />

        <div className="flex flex-col flex-1 min-w-0">
          <p className="elytro-text-bold-body">{contact.name || '--'}</p>
          <p
            className="elytro-text-tiny-body text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap"
            title={contact.address}
          >
            {contact.address}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-sm flex-shrink-0">
        <PencilLine
          onClick={onEdit}
          className="size-xl cursor-pointer stroke-gray-600 hover:stroke-gray-900"
        />
        <Trash2
          onClick={onDelete}
          className="size-xl cursor-pointer stroke-gray-600 hover:stroke-gray-900"
        />
      </div>
    </div>
  );
}
