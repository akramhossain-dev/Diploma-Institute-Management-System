import { useQuery } from '@tanstack/react-query';
import { studentResultService } from '@/services/student/student-result.service';

export function useStudentResults() {
  return useQuery({
    queryKey: ['student', 'results'],
    queryFn: () => studentResultService.getResults(),
  });
}
export default useStudentResults;
