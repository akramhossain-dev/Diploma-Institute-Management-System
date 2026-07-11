import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentFeeItem, StudentPaymentItem, StudentFeeSummary } from '@/types/student/student-fee.types';

export const studentFeeService = {
  getStudentFees: async (): Promise<StudentFeeItem[]> => {
    const response = await studentAxios.get<ApiResponse<StudentFeeItem[]>>('/fees');
    return response.data.data;
  },

  getStudentPaymentHistory: async (): Promise<StudentPaymentItem[]> => {
    const response = await studentAxios.get<ApiResponse<StudentPaymentItem[]>>('/fees/payments/history');
    return response.data.data;
  },

  getStudentFeeSummary: async (): Promise<StudentFeeSummary> => {
    const response = await studentAxios.get<ApiResponse<StudentFeeSummary>>('/fees/summary');
    return response.data.data;
  },
};

export default studentFeeService;

