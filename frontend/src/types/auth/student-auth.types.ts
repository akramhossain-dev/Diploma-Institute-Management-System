export interface StudentProfile {
  _id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  registrationNumber: string;
  semester: number;
  departmentId: string;
  batchId: string;
  status: 'active' | 'inactive';
}

export interface StudentLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    profile: StudentProfile;
    requiresPasswordChange?: boolean;
  };
}

export interface StudentSession {
  accessToken: string | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
}
