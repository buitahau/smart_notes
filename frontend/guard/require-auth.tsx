import { useMiniRouter } from '@context/router-context';
import { supabaseClient } from '@services/supabase-client-service';
import { useEffect } from 'react';

export function RequiredAuth({ children }: { children: React.ReactNode }) {
  const { navigate } = useMiniRouter();

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabaseClient.auth.getSession();
      const session = data.session;

      if (!session) {
        navigate('login');
        return;
      }

      const expireAt = session.expires_at ? session.expires_at * 1000 : 0; // Supabase gives seconds
      const now = Date.now();

      if (now > expireAt) {
        const { data: refresh, error: refreshError } = await supabaseClient.auth.refreshSession();
        if (refreshError || !refresh.session) {
          navigate('login');
          return;
        }
      }
    }
    checkSession();
  }, [navigate]);

  return <>{children}</>;
}
