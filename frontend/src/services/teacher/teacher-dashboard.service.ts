import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { TeacherDashboardData } from '@/types/teacher/dashboard.types';

export const teacherDashboardService = {
  getDashboardData: async (): Promise<TeacherDashboardData> => {
    const response = await teacherAxios.get<ApiResponse<TeacherDashboardData>>('/dashboard');
    return response.data.data;
  },
};

export default teacherDashboardService;

