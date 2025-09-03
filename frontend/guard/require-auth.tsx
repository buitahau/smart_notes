import { useMiniRouter } from '@context/router-context';
import { STORAGE_KEYS } from '@utils/constants';
import { storage } from '@utils/storage';
import { useEffect } from 'react';

export function RequiredAuth({ children }: { children: React.ReactNode }) {
  const { navigate } = useMiniRouter();

  useEffect(() => {
    async function validateToken() {
      const token = await storage.get(STORAGE_KEYS.TOKEN);
      if (!token) {
        navigate('login');
        return;
      }
    }
    validateToken();
  }, [navigate]);

  return <>{children}</>;
}
