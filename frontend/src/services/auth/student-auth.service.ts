import { studentAxios } from '@/lib/studentAxios';
import { publicAxios } from '@/lib/publicAxios';
import { StudentLoginInput } from '@/types/auth/student-login.schema';
import { StudentLoginResponse, StudentProfile } from '@/types/auth/student-auth.types';
import { ApiResponse } from '@/types/shared/api.types';

export const studentAuthService = {
  login: async (credentials: StudentLoginInput): Promise<StudentLoginResponse['data']> => {
    const response = await publicAxios.post<StudentLoginResponse>('/auth/student/login', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await studentAxios.post<ApiResponse<null>>('/auth/student/logout');
  },

  fetchProfile: async (): Promise<StudentProfile> => {
    const response = await studentAxios.get<ApiResponse<StudentProfile>>('/students/me');
    return response.data.data;
  },
};
