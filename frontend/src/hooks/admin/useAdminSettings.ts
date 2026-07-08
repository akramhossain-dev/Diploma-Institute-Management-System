import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsService } from '@/services/admin/settings.service';
import { UpdateSettingsInput } from '@/types/admin/settings.types';

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminSettingsService.getSettings(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSettingsInput) => adminSettingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      // Invalidate public settings too so the homepage/about page gets updated instantly!
      queryClient.invalidateQueries({ queryKey: ['public', 'institute'] });
    },
  });
}
