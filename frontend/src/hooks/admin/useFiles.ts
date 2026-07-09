import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFileManagerService } from '@/services/admin/file-manager.service';

export function useFiles(filters?: { search?: string; type?: string }) {
  const queryClient = useQueryClient();

  const filesQuery = useQuery({
    queryKey: ['admin', 'files', filters],
    queryFn: () => adminFileManagerService.getFiles(filters),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, moduleRef }: { file: File; moduleRef?: string }) =>
      adminFileManagerService.uploadFile(file, moduleRef),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'files'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminFileManagerService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'files'] });
    },
  });

  return {
    files: filesQuery.data || [],
    isLoading: filesQuery.isLoading,
    isError: filesQuery.isError,
    error: filesQuery.error,
    refetch: filesQuery.refetch,
    uploadFile: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteFile: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default useFiles;
