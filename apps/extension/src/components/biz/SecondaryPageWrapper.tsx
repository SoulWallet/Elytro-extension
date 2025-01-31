import { BackArrow } from '@/assets/icons/BackArrow';
import { navigateTo } from '@/utils/navigation';
import { cn } from '@/utils/shadcn/utils';
import { X } from 'lucide-react';
import React, { PropsWithChildren } from 'react';

interface ISecondaryPageWrapperProps extends PropsWithChildren {
  className?: string;
  children: React.ReactNode;
  title: string;
  closeable?: boolean;
  showBack?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
}

export default function SecondaryPageWrapper({
  children,
  title,
  closeable = false,
  showBack = history.length > 1,
  footer,
  onClose,
  onBack,
  className,
}: ISecondaryPageWrapperProps) {
  const handleClose = () => {
    onClose?.();
    navigateTo('side-panel', '/');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      history.back();
    }
  };

  return (
    <div className={cn('w-full h-full bg-gray-150 p-sm', className)}>
      <div className="flex flex-col flex-grow w-full h-full bg-white px-lg pb-lg rounded-lg">
        {/* Header: back button, title, close button */}
        <div className="flex flex-row items-center justify-center relative py-lg mb-sm">
          {showBack && (
            <BackArrow
              className="elytro-clickable-icon absolute left-0"
              onClick={handleBack}
            />
          )}
          <h3 className="text-body-bold">{title}</h3>
          {closeable && (
            <X
              className="elytro-clickable-icon absolute right-0"
              onClick={handleClose}
            />
          )}
        </div>

        {children}

        {/* Footer: fixed to bottom */}
        {footer && <div className="flex w-full mt-auto mb-md">{footer}</div>}
      </div>
    </div>
  );
}
