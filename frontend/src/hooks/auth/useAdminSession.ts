import { useEffect } from 'react';
import { useAdminAuthStore } from '@/store/auth/adminAuthStore';
import { adminAuthService } from '@/services/auth/admin-auth.service';
import { API_CONFIG } from '@/services/api/api-config';
import axios from 'axios';

export function useAdminSession() {
  const { accessToken, profile, isAuthenticated, isLoading, setSession, clearSession, setLoading, hydrateSession } =
    useAdminAuthStore();

  useEffect(() => {
    // 1. Try to hydrate the local state first
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    // 2. If already authenticated or loading, skip
    if (isAuthenticated || isLoading) return;

    // 3. Try to boot session silently using HTTP-only cookie refresh
    const bootstrap = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.baseURL}/auth/admin/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken, profile: adminProfile } = response.data.data;
        setSession(newAccessToken, adminProfile);
      } catch (err) {
        // Failed silent refresh -> clear state
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
export default useAdminSession;
