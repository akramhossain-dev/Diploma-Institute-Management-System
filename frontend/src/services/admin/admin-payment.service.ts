import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentBillingOverview } from '@/types/accountant/payment.types';

export const adminPaymentService = {
  getPaymentsOverview: async (): Promise<StudentBillingOverview[]> => {
    const response = await adminAxios.get<ApiResponse<StudentBillingOverview[]>>('/payments/overview');
    return response.data.data;
  },
};

export default adminPaymentService;
