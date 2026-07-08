export interface AccountantProfile {
  _id: string;
  fullName: string;
  email: string;
  staffId: string;
  status: 'active' | 'inactive';
}

export interface AccountantLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    profile: AccountantProfile;
    requiresPasswordChange?: boolean;
  };
}

export interface AccountantSession {
  accessToken: string | null;
  profile: AccountantProfile | null;
  isAuthenticated: boolean;
}
