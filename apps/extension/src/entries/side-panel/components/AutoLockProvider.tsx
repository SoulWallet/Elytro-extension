import React, { useState, useEffect, useRef, PropsWithChildren } from 'react';
import { AutoLockContext } from '../contexts/auto-lock-context';
import { useKeyring } from '@/contexts/keyring';
import _debounce from 'lodash/debounce';

export const NEVER_LOCK = 0; // never lock
const ONE_MINUTE = 60 * 1000;
export const ELYTRO_AUTO_LOCK_TIME = 'ELYTRO_AUTO_LOCK_TIME';

export const AutoLockProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { lock } = useKeyring();

  const getAutoLockTime = () => {
    // should use background server to handle this? so that if user close the extension, the timer will still work
    const storedTime = localStorage.getItem(ELYTRO_AUTO_LOCK_TIME);
    return storedTime ? parseInt(storedTime, 10) * ONE_MINUTE : NEVER_LOCK;
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const autoLockTime = getAutoLockTime();
    if (autoLockTime === 0 || isLocked) {
      return;
    }
    const newTimer = setTimeout(() => {
      setIsLocked(true);
      lock();
    }, autoLockTime);
    timerRef.current = newTimer;
  };

  useEffect(() => {
    resetTimer();
    const handleActivity = _debounce(resetTimer, 1000);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [resetTimer]);

  return (
    <AutoLockContext.Provider value={{ isLocked, resetTimer }}>
      {children}
    </AutoLockContext.Provider>
  );
};

export default AutoLockProvider;
