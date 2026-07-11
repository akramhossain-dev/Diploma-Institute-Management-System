import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentBillingOverview } from '@/types/accountant/payment.types';

export const accountantFeeService = {
  getFeesOverview: async (): Promise<StudentBillingOverview[]> => {
    const response = await accountantAxios.get<ApiResponse<StudentBillingOverview[]>>('/fees/overview');
    return response.data.data;
  },
};

export default accountantFeeService;

