import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/public/course.service';

export function useCourses(departmentId?: string) {
  return useQuery({
    queryKey: ['public', 'courses', { departmentId }],
    queryFn: () => courseService.getCourses(departmentId),
    staleTime: 1000 * 60 * 10, 
  });
}
export default useCourses;
