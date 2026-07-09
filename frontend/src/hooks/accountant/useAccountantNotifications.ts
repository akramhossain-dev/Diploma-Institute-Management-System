import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountantNotificationService } from '@/services/accountant/accountant-notification.service';

export function useAccountantNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['accountant', 'notifications'],
    queryFn: () => accountantNotificationService.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => accountantNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountant', 'notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => accountantNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountant', 'notifications'] });
    },
  });

  const unreadCount = query.data?.filter(n => !n.read).length || 0;

  return {
    notifications: query.data || [],
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarking: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
}

export default useAccountantNotifications;
