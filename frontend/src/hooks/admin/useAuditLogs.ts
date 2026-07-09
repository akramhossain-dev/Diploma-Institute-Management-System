import { useQuery } from '@tanstack/react-query';
import { adminAuditLogService } from '@/services/admin/audit-log.service';

export function useAuditLogs(filters?: {
  actorType?: string;
  module?: string;
  action?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', filters],
    queryFn: () => adminAuditLogService.getAuditLogs(filters),
  });
}

export default useAuditLogs;
