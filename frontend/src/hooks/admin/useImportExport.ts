import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminImportExportService } from '@/services/admin/import-export.service';

export function useImportExport() {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['admin', 'import-jobs'],
    queryFn: () => adminImportExportService.getImportJobs(),
    refetchInterval: 5000, 
  });

  const importMutation = useMutation({
    mutationFn: ({
      module,
      file,
    }: {
      module: 'students' | 'teachers' | 'accountants' | 'fees';
      file: File;
    }) => adminImportExportService.triggerImport(module, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'import-jobs'] });
    },
  });

  const exportMutation = useMutation({
    mutationFn: (module: string) => adminImportExportService.triggerExport(module),
  });

  return {
    jobs: jobsQuery.data || [],
    isLoading: jobsQuery.isLoading,
    isError: jobsQuery.isError,
    refetchJobs: jobsQuery.refetch,
    triggerImport: importMutation.mutateAsync,
    isImporting: importMutation.isPending,
    triggerExport: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
  };
}

export default useImportExport;
