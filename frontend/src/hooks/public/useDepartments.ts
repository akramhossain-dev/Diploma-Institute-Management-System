import { useQuery } from '@tanstack/react-query';
import { departmentService } from '@/services/public/department.service';

export function useDepartments() {
  return useQuery({
    queryKey: ['public', 'departments'],
    queryFn: () => departmentService.getDepartments(),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}
export default useDepartments;
