import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AccountantDashboardData } from '@/types/accountant/dashboard.types';

export const accountantDashboardService = {
  getDashboardData: async (): Promise<AccountantDashboardData> => {
    const response = await accountantAxios.get<ApiResponse<AccountantDashboardData>>('/dashboard');
    return response.data.data;
  },
};

export default accountantDashboardService;

