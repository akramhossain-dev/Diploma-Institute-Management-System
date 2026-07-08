import { useQuery } from '@tanstack/react-query';
import { studentRoutineService } from '@/services/student/student-routine.service';

export function useStudentRoutine() {
  return useQuery({
    queryKey: ['student', 'routine'],
    queryFn: () => studentRoutineService.getRoutine(),
  });
}
export default useStudentRoutine;
