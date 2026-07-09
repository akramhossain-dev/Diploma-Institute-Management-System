import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AuditLog } from '@/types/admin/audit-log.types';

export const adminAuditLogService = {
  getAuditLogs: async (filters?: {
    actorType?: string;
    module?: string;
    action?: string;
    search?: string;
  }): Promise<AuditLog[]> => {
    const response = await adminAxios.get<ApiResponse<AuditLog[]>>('/audit-logs', { params: filters });
    return response.data.data;
  },
};

export default adminAuditLogService;
