import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AccountantDashboardData } from '@/types/accountant/dashboard.types';

let mockAccountantDashboard: AccountantDashboardData = {
  todayCollection: 12500,
  totalPendingDues: 450000,
  paymentCountThisMonth: 124,
  recentTransactions: [
    { _id: 'trx-1', studentName: 'Ahsan Habib', studentRoll: '102938', feeTitle: 'Admission Fee 2026', amount: 15000, paymentDate: '2026-07-05', paymentMethod: 'cash' },
    { _id: 'trx-2', studentName: 'Nusrat Jahan', studentRoll: '102939', feeTitle: 'Admission Fee 2026', amount: 15000, paymentDate: '2026-07-06', paymentMethod: 'bank' },
    { _id: 'trx-3', studentName: 'Nusrat Jahan', studentRoll: '102939', feeTitle: 'Semester Exam Fee 2026', amount: 3000, paymentDate: '2026-07-06', paymentMethod: 'mobile_banking' },
  ],
  recentNotices: [
    { _id: 'not-1', title: 'Semester Exam Fees Circular Summer 2026', publishedDate: '2026-07-05' },
    { _id: 'not-2', title: 'Accounts Closing and Annual Report Schedule', publishedDate: '2026-07-07' },
  ],
};

export const accountantDashboardService = {
  getDashboardData: async (): Promise<AccountantDashboardData> => {
    try {
      const response = await accountantAxios.get<ApiResponse<AccountantDashboardData>>('/dashboard');
      return response.data.data;
    } catch (e) {
      console.warn('[Accountant Service] GET /dashboard failed. Falling back to mock data.');
      return { ...mockAccountantDashboard };
    }
  },
};

export default accountantDashboardService;
