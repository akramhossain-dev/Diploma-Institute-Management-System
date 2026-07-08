import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTeacherService } from '@/services/admin/teacher.service';
import { CreateTeacherInput, UpdateTeacherInput } from '@/types/admin/teacher.types';

export function useAdminTeachers() {
  return useQuery({
    queryKey: ['admin', 'teachers'],
    queryFn: () => adminTeacherService.getTeachers(),
  });
}

export function useAdminTeacher(id: string) {
  return useQuery({
    queryKey: ['admin', 'teachers', id],
    queryFn: () => adminTeacherService.getTeacher(id),
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeacherInput) => adminTeacherService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherInput }) =>
      adminTeacherService.updateTeacher(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers', variables.id] });
    },
  });
}
