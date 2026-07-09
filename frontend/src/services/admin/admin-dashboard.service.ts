import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AdminDashboardSummary, StudentReportRow, AttendanceReportRow, FinanceReportRow, AdminAnalyticsData } from '@/types/admin/dashboard.types';

export const adminDashboardService = {
  getDashboardSummary: async (): Promise<AdminDashboardSummary> => {
    const response = await adminAxios.get<ApiResponse<AdminDashboardSummary>>('/dashboard/summary');
    return response.data.data;
  },

  getStudentReport: async (): Promise<StudentReportRow[]> => {
    const response = await adminAxios.get<ApiResponse<StudentReportRow[]>>('/reports/students');
    return response.data.data;
  },

  getAttendanceReport: async (): Promise<AttendanceReportRow[]> => {
    const response = await adminAxios.get<ApiResponse<AttendanceReportRow[]>>('/reports/attendance');
    return response.data.data;
  },

  getFinanceReport: async (): Promise<FinanceReportRow[]> => {
    const response = await adminAxios.get<ApiResponse<FinanceReportRow[]>>('/reports/finance');
    return response.data.data;
  },

  getAnalyticsData: async (): Promise<AdminAnalyticsData> => {
    const response = await adminAxios.get<ApiResponse<AdminAnalyticsData>>('/analytics/summary');
    return response.data.data;
  },
};

export default adminDashboardService;
