// Memory cache for tokens per entity
const tokenCache: Record<string, string | null> = {
  admin: null,
  student: null,
  teacher: null,
  accountant: null,
};

export const tokenManager = {
  getAccessToken: (entityType: 'admin' | 'student' | 'teacher' | 'accountant'): string | null => {
    return tokenCache[entityType];
  },

  setAccessToken: (entityType: 'admin' | 'student' | 'teacher' | 'accountant', token: string | null): void => {
    tokenCache[entityType] = token;
  },

  clearAllTokens: (): void => {
    tokenCache.admin = null;
    tokenCache.student = null;
    tokenCache.teacher = null;
    tokenCache.accountant = null;
  },
};

// Lightweight Cookie Utilities for Next.js Middleware Routing
export const cookieManager = {
  setEntityIndicator: (entityType: 'admin' | 'student' | 'teacher' | 'accountant' | null): void => {
    if (typeof window === 'undefined') return;

    if (!entityType) {
      // Clear cookie
      document.cookie = 'dims_entity=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      return;
    }

    // Set cookie for 7 days
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `dims_entity=${entityType}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },

  getEntityIndicator: (): string | null => {
    if (typeof window === 'undefined') return null;

    const match = document.cookie.match(/(^| )dims_entity=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  },

  clearEntityIndicator: (): void => {
    cookieManager.setEntityIndicator(null);
  },
};
