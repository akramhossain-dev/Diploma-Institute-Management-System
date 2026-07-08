import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSessionService } from '@/services/admin/session.service';
import { CreateSessionInput, UpdateSessionInput } from '@/types/admin/session.types';

export function useAdminSessions() {
  return useQuery({
    queryKey: ['admin', 'sessions'],
    queryFn: () => adminSessionService.getSessions(),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionInput) => adminSessionService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSessionInput }) =>
      adminSessionService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sessions'] });
    },
  });
}
