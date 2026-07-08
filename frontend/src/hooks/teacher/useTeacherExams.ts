import { useQuery } from '@tanstack/react-query';
import { teacherExamService } from '@/services/teacher/teacher-exam.service';

export function useTeacherExams() {
  return useQuery({
    queryKey: ['teacher', 'exams-duties'],
    queryFn: () => teacherExamService.getExamDuties(),
  });
}
export default useTeacherExams;
