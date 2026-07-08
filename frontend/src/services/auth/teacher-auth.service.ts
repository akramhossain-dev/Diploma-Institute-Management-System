import { teacherAxios } from '@/lib/teacherAxios';
import { publicAxios } from '@/lib/publicAxios';
import { TeacherLoginInput } from '@/types/auth/teacher-login.schema';
import { TeacherLoginResponse, TeacherProfile } from '@/types/auth/teacher-auth.types';
import { ApiResponse } from '@/types/shared/api.types';

export const teacherAuthService = {
  login: async (credentials: TeacherLoginInput): Promise<TeacherLoginResponse['data']> => {
    const response = await publicAxios.post<TeacherLoginResponse>('/auth/teacher/login', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await teacherAxios.post<ApiResponse<null>>('/auth/teacher/logout');
  },

  fetchProfile: async (): Promise<TeacherProfile> => {
    const response = await teacherAxios.get<ApiResponse<TeacherProfile>>('/teachers/me');
    return response.data.data;
  },
};
