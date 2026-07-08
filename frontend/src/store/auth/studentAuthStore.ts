import { create } from 'zustand';
import { StudentProfile } from '@/types/auth/student-auth.types';
import { tokenManager, cookieManager } from '@/lib/auth/token-manager';
import { sessionManager } from '@/lib/auth/session-manager';

interface StudentAuthState {
  accessToken: string | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, profile: StudentProfile) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
  hydrateSession: () => void;
}

export const useStudentAuthStore = create<StudentAuthState>((set) => ({
  accessToken: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,

  setSession: (token: string, profile: StudentProfile) => {
    tokenManager.setAccessToken('student', token);
    sessionManager.saveProfile('student', profile);
    cookieManager.setEntityIndicator('student');
    set({
      accessToken: token,
      profile,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearSession: () => {
    tokenManager.setAccessToken('student', null);
    sessionManager.clearProfile('student');
    
    if (cookieManager.getEntityIndicator() === 'student') {
      cookieManager.clearEntityIndicator();
    }

    set({
      accessToken: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  hydrateSession: () => {
    const cachedProfile = sessionManager.getProfile<StudentProfile>('student');
    const token = tokenManager.getAccessToken('student');
    if (cachedProfile && token) {
      set({
        accessToken: token,
        profile: cachedProfile,
        isAuthenticated: true,
      });
    }
  },
}));
