import { useQuery } from '@tanstack/react-query';
import { studentDashboardService } from '@/services/student/student-dashboard.service';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: () => studentDashboardService.getDashboardData(),
  });
}
export default useStudentDashboard;
