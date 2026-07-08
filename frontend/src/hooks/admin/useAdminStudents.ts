import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminStudentService } from '@/services/admin/student.service';
import { CreateStudentInput, UpdateStudentInput } from '@/types/admin/student.types';

export function useAdminStudents() {
  return useQuery({
    queryKey: ['admin', 'students'],
    queryFn: () => adminStudentService.getStudents(),
  });
}

export function useAdminStudent(id: string) {
  return useQuery({
    queryKey: ['admin', 'students', id],
    queryFn: () => adminStudentService.getStudent(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentInput) => adminStudentService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
      adminStudentService.updateStudent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'students', variables.id] });
    },
  });
}
export default useAdminStudents;
