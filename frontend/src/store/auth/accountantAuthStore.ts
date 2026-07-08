import { create } from 'zustand';
import { AccountantProfile } from '@/types/auth/accountant-auth.types';
import { tokenManager, cookieManager } from '@/lib/auth/token-manager';
import { sessionManager } from '@/lib/auth/session-manager';

interface AccountantAuthState {
  accessToken: string | null;
  profile: AccountantProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (token: string, profile: AccountantProfile) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
  hydrateSession: () => void;
}

export const useAccountantAuthStore = create<AccountantAuthState>((set) => ({
  accessToken: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,

  setSession: (token: string, profile: AccountantProfile) => {
    tokenManager.setAccessToken('accountant', token);
    sessionManager.saveProfile('accountant', profile);
    cookieManager.setEntityIndicator('accountant');
    set({
      accessToken: token,
      profile,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearSession: () => {
    tokenManager.setAccessToken('accountant', null);
    sessionManager.clearProfile('accountant');
    
    if (cookieManager.getEntityIndicator() === 'accountant') {
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
    const cachedProfile = sessionManager.getProfile<AccountantProfile>('accountant');
    const token = tokenManager.getAccessToken('accountant');
    if (cachedProfile && token) {
      set({
        accessToken: token,
        profile: cachedProfile,
        isAuthenticated: true,
      });
    }
  },
}));
