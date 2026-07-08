import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamMappingService } from '@/services/admin/exam-mapping.service';
import { CreateExamMappingInput, UpdateExamMappingInput } from '@/types/admin/exam-mapping.types';

export function useExamMappings() {
  return useQuery({
    queryKey: ['admin', 'exam-mappings'],
    queryFn: () => adminExamMappingService.getMappings(),
  });
}

export function useCreateExamMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExamMappingInput) => adminExamMappingService.createMapping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'exam-mappings'] });
      // Invalidate teacher duties as well to refresh rosters instantly!
      queryClient.invalidateQueries({ queryKey: ['teacher', 'exams-duties'] });
    },
  });
}

export function useUpdateExamMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamMappingInput }) =>
      adminExamMappingService.updateMapping(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'exam-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'exams-duties'] });
    },
  });
}

export function useDeleteExamMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminExamMappingService.deleteMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'exam-mappings'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'exams-duties'] });
    },
  });
}
