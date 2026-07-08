import { create } from 'zustand';
import { AdminProfile } from '@/types/auth/admin-auth.types';
import { tokenManager, cookieManager } from '@/lib/auth/token-manager';
import { sessionManager } from '@/lib/auth/session-manager';

interface AdminAuthState {
  accessToken: string | null;
  profile: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, profile: AdminProfile) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
  hydrateSession: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  accessToken: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,

  setSession: (token: string, profile: AdminProfile) => {
    tokenManager.setAccessToken('admin', token);
    sessionManager.saveProfile('admin', profile);
    cookieManager.setEntityIndicator('admin');
    set({
      accessToken: token,
      profile,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearSession: () => {
    tokenManager.setAccessToken('admin', null);
    sessionManager.clearProfile('admin');
    
    // Only clear cookie indicator if current route/indicator belongs to admin
    if (cookieManager.getEntityIndicator() === 'admin') {
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
    const cachedProfile = sessionManager.getProfile<AdminProfile>('admin');
    const token = tokenManager.getAccessToken('admin');
    if (cachedProfile && token) {
      set({
        accessToken: token,
        profile: cachedProfile,
        isAuthenticated: true,
      });
    }
  },
}));
