export const sessionManager = {
  saveProfile: <T>(entityType: 'admin' | 'student' | 'teacher' | 'accountant', profile: T): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(`dims_profile_${entityType}`, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile to sessionStorage', e);
    }
  },

  getProfile: <T>(entityType: 'admin' | 'student' | 'teacher' | 'accountant'): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(`dims_profile_${entityType}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  clearProfile: (entityType: 'admin' | 'student' | 'teacher' | 'accountant'): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(`dims_profile_${entityType}`);
  },

  clearAllSessions: (): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('dims_profile_admin');
    sessionStorage.removeItem('dims_profile_student');
    sessionStorage.removeItem('dims_profile_teacher');
    sessionStorage.removeItem('dims_profile_accountant');
  },
};
