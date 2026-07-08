import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminNoticeService } from '@/services/admin/notice-admin.service';
import { CreateNoticeInput, UpdateNoticeInput } from '@/types/admin/notice-admin.types';

export function useAdminNotices() {
  return useQuery({
    queryKey: ['admin', 'notices'],
    queryFn: () => adminNoticeService.getNotices(),
  });
}

export function useAdminNotice(id: string) {
  return useQuery({
    queryKey: ['admin', 'notices', id],
    queryFn: () => adminNoticeService.getNotice(id),
    enabled: !!id,
  });
}

export function useCreateAdminNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoticeInput) => adminNoticeService.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      // Invalidate public notices cache too!
      queryClient.invalidateQueries({ queryKey: ['public', 'notices'] });
    },
  });
}

export function useUpdateAdminNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoticeInput }) =>
      adminNoticeService.updateNotice(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['public', 'notices'] });
    },
  });
}

export function useDeleteAdminNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminNoticeService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'notices'] });
    },
  });
}
