export interface AdminProfile {
  _id: string;
  fullName: string;
  email: string;
  role: string; // e.g. 'admin'
  isSuperAdmin: boolean;
  status: 'active' | 'inactive';
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    profile: AdminProfile;
    requiresPasswordChange?: boolean;
  };
}

export interface AdminSession {
  accessToken: string | null;
  profile: AdminProfile | null;
  isAuthenticated: boolean;
}
