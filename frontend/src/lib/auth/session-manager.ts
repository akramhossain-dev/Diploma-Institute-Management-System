export const sessionManager = {
  saveProfile: <T>(entityType: 'admin' | 'student' | 'teacher' | 'accountant', profile: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`dims_profile_${entityType}`, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
    }
  },

  getProfile: <T>(entityType: 'admin' | 'student' | 'teacher' | 'accountant'): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(`dims_profile_${entityType}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearProfile: (entityType: 'admin' | 'student' | 'teacher' | 'accountant'): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`dims_profile_${entityType}`);
  },

  clearAllSessions: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('dims_profile_admin');
    localStorage.removeItem('dims_profile_student');
    localStorage.removeItem('dims_profile_teacher');
    localStorage.removeItem('dims_profile_accountant');
  },
};
