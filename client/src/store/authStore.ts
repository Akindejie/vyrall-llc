import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import { auth } from '../utils/firebase';
import { userState } from './atoms';

/**
 * Hook to sync Firebase auth state with Recoil
 * Call this once at the app level to keep auth state in sync
 */
export const useAuthSync = () => {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [setUser]);
};
