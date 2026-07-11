import { useEffect, useRef } from 'react';
import { useAdminAuthStore } from '@/store/auth/adminAuthStore';
import { API_CONFIG } from '@/services/api/api-config';
import axios from 'axios';

export function useAdminSession() {
  const { accessToken, profile, isAuthenticated, isLoading, setSession, clearSession, setLoading, hydrateSession } =
    useAdminAuthStore();
  const refreshAttempted = useRef(false);

  useEffect(() => {
    
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    // 2. If already authenticated, loading, or already attempted refresh, skip
    if (isAuthenticated || isLoading || refreshAttempted.current) return;

    // 3. Try to boot session silently using HTTP-only cookie refresh
    const bootstrap = async () => {
      refreshAttempted.current = true;
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.baseURL}/auth/admin/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken, profile: adminProfile } = response.data.data;
        const existingProfile = useAdminAuthStore.getState().profile;
        setSession(newAccessToken, adminProfile || existingProfile);
      } catch {
        
        clearSession();
        if (typeof window !== 'undefined') {
          window.location.href = '/login/admin';
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
export default useAdminSession;

