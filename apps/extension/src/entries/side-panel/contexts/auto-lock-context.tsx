import { createContext, useContext } from 'react';

interface AutoLockContextProps {
  isLocked: boolean;
  resetTimer: () => void;
}

export const AutoLockContext = createContext<AutoLockContextProps | undefined>(
  undefined
);

export const useAutoLock = () => {
  const context = useContext(AutoLockContext);
  if (!context) {
    throw new Error('useAutoLock must be used within an AutoLockProvider');
  }
  return context;
};
