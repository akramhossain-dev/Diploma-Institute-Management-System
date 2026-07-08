import { create } from 'zustand';
import { TeacherProfile } from '@/types/auth/teacher-auth.types';
import { tokenManager, cookieManager } from '@/lib/auth/token-manager';
import { sessionManager } from '@/lib/auth/session-manager';

interface TeacherAuthState {
  accessToken: string | null;
  profile: TeacherProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, profile: TeacherProfile) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
  hydrateSession: () => void;
}

export const useTeacherAuthStore = create<TeacherAuthState>((set) => ({
  accessToken: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,

  setSession: (token: string, profile: TeacherProfile) => {
    tokenManager.setAccessToken('teacher', token);
    sessionManager.saveProfile('teacher', profile);
    cookieManager.setEntityIndicator('teacher');
    set({
      accessToken: token,
      profile,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearSession: () => {
    tokenManager.setAccessToken('teacher', null);
    sessionManager.clearProfile('teacher');
    
    if (cookieManager.getEntityIndicator() === 'teacher') {
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
    const cachedProfile = sessionManager.getProfile<TeacherProfile>('teacher');
    const token = tokenManager.getAccessToken('teacher');
    if (cachedProfile && token) {
      set({
        accessToken: token,
        profile: cachedProfile,
        isAuthenticated: true,
      });
    }
  },
}));
