import { useQuery } from '@tanstack/react-query';
import { teacherDashboardService } from '@/services/teacher/teacher-dashboard.service';

export function useTeacherDashboard() {
  return useQuery({
    queryKey: ['teacher', 'dashboard'],
    queryFn: () => teacherDashboardService.getDashboardData(),
  });
}
export default useTeacherDashboard;
