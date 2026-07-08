import { useQuery } from '@tanstack/react-query';
import { adminDashboardService } from '@/services/admin/admin-dashboard.service';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboardSummary'],
    queryFn: () => adminDashboardService.getDashboardSummary(),
  });
}

export function useAdminReports() {
  const studentsQuery = useQuery({
    queryKey: ['admin', 'reports', 'students'],
    queryFn: () => adminDashboardService.getStudentReport(),
  });

  const attendanceQuery = useQuery({
    queryKey: ['admin', 'reports', 'attendance'],
    queryFn: () => adminDashboardService.getAttendanceReport(),
  });

  const financeQuery = useQuery({
    queryKey: ['admin', 'reports', 'finance'],
    queryFn: () => adminDashboardService.getFinanceReport(),
  });

  return {
    studentsQuery,
    attendanceQuery,
    financeQuery,
    isLoading: studentsQuery.isLoading || attendanceQuery.isLoading || financeQuery.isLoading,
  };
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminDashboardService.getAnalyticsData(),
  });
}
