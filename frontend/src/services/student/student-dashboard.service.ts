import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentDashboardData } from '@/types/student/dashboard.types';

export const studentDashboardService = {
  getDashboardData: async (): Promise<StudentDashboardData> => {
    const response = await studentAxios.get<ApiResponse<StudentDashboardData>>('/dashboard');
    return response.data.data;
  },
};

export default studentDashboardService;

