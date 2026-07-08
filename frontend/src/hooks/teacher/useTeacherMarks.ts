import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherMarksService } from '@/services/teacher/marks.service';
import { MarksSubmissionInput } from '@/types/teacher/marks.types';

export function useSubmitMarks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MarksSubmissionInput) => teacherMarksService.submitMarks(data),
    onSuccess: () => {
      // Invalidate duties registry and student results feed!
      queryClient.invalidateQueries({ queryKey: ['teacher', 'exams-duties'] });
      queryClient.invalidateQueries({ queryKey: ['student', 'results'] });
    },
  });
}
export default useSubmitMarks;
