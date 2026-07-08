import { useEffect } from 'react';
import { useAccountantAuthStore } from '@/store/auth/accountantAuthStore';
import { API_CONFIG } from '@/services/api/api-config';
import axios from 'axios';

export function useAccountantSession() {
  const { accessToken, profile, isAuthenticated, isLoading, setSession, clearSession, setLoading, hydrateSession } =
    useAccountantAuthStore();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (isAuthenticated || isLoading) return;

    const bootstrap = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.baseURL}/auth/accountant/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken, profile: accountantProfile } = response.data.data;
        setSession(newAccessToken, accountantProfile);
      } catch (err) {
        clearSession();
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
