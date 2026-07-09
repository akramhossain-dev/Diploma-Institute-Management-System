import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentFeeItem, StudentPaymentItem, StudentFeeSummary } from '@/types/student/student-fee.types';

const mockStudentFees: StudentFeeItem[] = [
  {
    _id: 'fee-1',
    name: 'Admission Fee 2026',
    amount: 15000,
    paidAmount: 15000,
    dueAmount: 0,
    dueDate: '2026-07-30',
    status: 'paid',
  },
  {
    _id: 'fee-2',
    name: 'Semester Exam Fee 2026',
    amount: 3000,
    paidAmount: 0,
    dueAmount: 3000,
    dueDate: '2026-08-15',
    status: 'unpaid',
  },
];

const mockStudentPayments: StudentPaymentItem[] = [
  {
    _id: 'pay-rec-1',
    amount: 15000,
    paymentDate: '2026-07-05',
    paymentMethod: 'cash',
    reference: 'Direct Counter Cash',
  },
];

export const studentFeeService = {
  getStudentFees: async (): Promise<StudentFeeItem[]> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentFeeItem[]>>('/fees');
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },

  getStudentPaymentHistory: async (): Promise<StudentPaymentItem[]> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentPaymentItem[]>>('/fees/payments/history');
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },

  getStudentFeeSummary: async (): Promise<StudentFeeSummary> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentFeeSummary>>('/fees/summary');
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },
};

export default studentFeeService;
