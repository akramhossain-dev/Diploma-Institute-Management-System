import { useQuery } from '@tanstack/react-query';
import { accountantDashboardService } from '@/services/accountant/accountant-dashboard.service';

export function useAccountantDashboard() {
  return useQuery({
    queryKey: ['accountant', 'dashboard'],
    queryFn: () => accountantDashboardService.getDashboardData(),
  });
}
export default useAccountantDashboard;
