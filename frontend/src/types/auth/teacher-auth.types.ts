export interface TeacherProfile {
  _id: string;
  fullName: string;
  email: string;
  employeeId: string;
  departmentId: string;
  designation: string;
  status: 'active' | 'inactive';
}

export interface TeacherLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    profile: TeacherProfile;
    requiresPasswordChange?: boolean;
  };
}

export interface TeacherSession {
  accessToken: string | null;
  profile: TeacherProfile | null;
  isAuthenticated: boolean;
}
