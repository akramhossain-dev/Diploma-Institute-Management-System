import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSemesterService } from '@/services/admin/semester.service';
import { CreateSemesterInput, UpdateSemesterInput } from '@/types/admin/semester.types';

export function useAdminSemesters() {
  return useQuery({
    queryKey: ['admin', 'semesters'],
    queryFn: () => adminSemesterService.getSemesters(),
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSemesterInput) => adminSemesterService.createSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'semesters'] });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSemesterInput }) =>
      adminSemesterService.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'semesters'] });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSemesterService.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'semesters'] });
    },
  });
}
