import { useEffect, useRef } from 'react';
import { useAccountantAuthStore } from '@/store/auth/accountantAuthStore';
import { API_CONFIG } from '@/services/api/api-config';
import axios from 'axios';

export function useAccountantSession() {
  const { accessToken, profile, isAuthenticated, isLoading, setSession, clearSession, setLoading, hydrateSession } =
    useAccountantAuthStore();
  const refreshAttempted = useRef(false);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (isAuthenticated || isLoading || refreshAttempted.current) return;

    const bootstrap = async () => {
      refreshAttempted.current = true;
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.baseURL}/auth/accountant/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken, profile: accountantProfile } = response.data.data;
        const existingProfile = useAccountantAuthStore.getState().profile;
        setSession(newAccessToken, accountantProfile || existingProfile);
      } catch {
        clearSession();
        if (typeof window !== 'undefined') {
          window.location.href = '/login/accountant';
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [isAuthenticated, isLoading, setSession, clearSession, setLoading]);

  return {
    accessToken,
    profile,
    isAuthenticated,
    isLoading,
  };
}
export default useAccountantSession;
