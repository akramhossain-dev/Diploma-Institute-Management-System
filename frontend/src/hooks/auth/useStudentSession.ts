import { useEffect } from 'react';
import { useStudentAuthStore } from '@/store/auth/studentAuthStore';
import { API_CONFIG } from '@/services/api/api-config';
import axios from 'axios';

export function useStudentSession() {
  const { accessToken, profile, isAuthenticated, isLoading, setSession, clearSession, setLoading, hydrateSession } =
    useStudentAuthStore();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (isAuthenticated || isLoading) return;

    const bootstrap = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.baseURL}/auth/student/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken, profile: studentProfile } = response.data.data;
        const existingProfile = useStudentAuthStore.getState().profile;
        setSession(newAccessToken, studentProfile || existingProfile);
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
export default useStudentSession;
