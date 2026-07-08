import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamService } from '@/services/admin/exam.service';
import { CreateExamInput, UpdateExamInput } from '@/types/admin/exam.types';

export function useExams() {
  return useQuery({
    queryKey: ['admin', 'exams'],
    queryFn: () => adminExamService.getExams(),
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: ['admin', 'exams', id],
    queryFn: () => adminExamService.getExam(id),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExamInput) => adminExamService.createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'exams'] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamInput }) =>
      adminExamService.updateExam(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'exams'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'exams', variables.id] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminExamService.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'exams'] });
    },
  });
}
export default useExams;
