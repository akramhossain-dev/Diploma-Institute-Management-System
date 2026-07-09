import { useEffect } from 'react';
import { useTeacherAuthStore } from '@/store/auth/teacherAuthStore';
import { API_CONFIG } from '@/services/api/api-config';
import axios from 'axios';

export function useTeacherSession() {
  const { accessToken, profile, isAuthenticated, isLoading, setSession, clearSession, setLoading, hydrateSession } =
    useTeacherAuthStore();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (isAuthenticated || isLoading) return;

    const bootstrap = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_CONFIG.baseURL}/auth/teacher/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken, profile: teacherProfile } = response.data.data;
        const existingProfile = useTeacherAuthStore.getState().profile;
        setSession(newAccessToken, teacherProfile || existingProfile);
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
export default useTeacherSession;
