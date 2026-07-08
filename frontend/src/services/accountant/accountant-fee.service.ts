import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentBillingOverview } from '@/types/accountant/payment.types';

let mockAccountantFees: StudentBillingOverview[] = [
  {
    studentId: 'stud-1',
    studentName: 'Ahsan Habib',
    studentRoll: '102938',
    departmentName: 'Computer Technology',
    semesterName: '3rd Semester',
    sessionName: '2025-2026',
    totalAssigned: 18000,
    totalPaid: 15000,
    totalDue: 3000,
    paymentStatus: 'partial',
    lastPaymentDate: '2026-07-05',
  },
  {
    studentId: 'stud-2',
    studentName: 'Nusrat Jahan',
    studentRoll: '102939',
    departmentName: 'Electronics Technology',
    semesterName: '3rd Semester',
    sessionName: '2025-2026',
    totalAssigned: 18000,
    totalPaid: 18000,
    totalDue: 0,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-07-06',
  },
  {
    studentId: 'stud-3',
    studentName: 'Rifat Al-Mumin',
    studentRoll: '102940',
    departmentName: 'Computer Technology',
    semesterName: '1st Semester',
    sessionName: '2025-2026',
    totalAssigned: 15000,
    totalPaid: 0,
    totalDue: 15000,
    paymentStatus: 'unpaid',
    lastPaymentDate: undefined,
  },
];

export const accountantFeeService = {
  getFeesOverview: async (): Promise<StudentBillingOverview[]> => {
    try {
      const response = await accountantAxios.get<ApiResponse<StudentBillingOverview[]>>('/fees/overview');
      return response.data.data;
    } catch (e) {
      console.warn('[Accountant Service] GET /fees/overview failed. Falling back to mock data.');
      return [...mockAccountantFees];
    }
  },
};

export default accountantFeeService;
