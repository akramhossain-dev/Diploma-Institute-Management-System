import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AuditLog } from '@/types/admin/audit-log.types';

const mockAuditLogs: AuditLog[] = [
  {
    _id: 'audit-1',
    action: 'CREATE_STUDENT',
    actorType: 'admin',
    actorName: 'Super Admin',
    actorIdentifier: 'admin@dims.edu.bd',
    targetModule: 'User Management',
    targetEntity: 'Student (CST-2026-001)',
    timestamp: '2026-07-09T10:00:00Z',
    metadata: { ip: '192.168.1.50', userAgent: 'Chrome/120.0.0', details: 'Added new active student Akram Hossain' },
  },
  {
    _id: 'audit-2',
    action: 'UPDATE_FEES',
    actorType: 'accountant',
    actorName: 'Rahim Uddin',
    actorIdentifier: 'rahim@dims.edu.bd',
    targetModule: 'Finance Management',
    targetEntity: 'Invoice (INV-9821)',
    timestamp: '2026-07-09T11:15:30Z',
    metadata: { ip: '192.168.1.62', amount: 5000, status: 'Paid' },
  },
  {
    _id: 'audit-3',
    action: 'PUBLISH_NOTICE',
    actorType: 'admin',
    actorName: 'Super Admin',
    actorIdentifier: 'admin@dims.edu.bd',
    targetModule: 'Notice Board',
    targetEntity: 'Notice (Session 2026 Reschedule)',
    timestamp: '2026-07-09T12:05:00Z',
    metadata: { audience: 'all', category: 'academic' },
  },
  {
    _id: 'audit-4',
    action: 'SUBMIT_MARKS',
    actorType: 'teacher',
    actorName: 'Dr. M. A. Karim',
    actorIdentifier: 'karim@dims.edu.bd',
    targetModule: 'Exam & Result System',
    targetEntity: 'Marksheet (CST-501-Midterm)',
    timestamp: '2026-07-09T12:45:10Z',
    metadata: { course: 'Microprocessors', studentCount: 45 },
  },
];

export const adminAuditLogService = {
  getAuditLogs: async (filters?: {
    actorType?: string;
    module?: string;
    action?: string;
    search?: string;
  }): Promise<AuditLog[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<AuditLog[]>>('/audit-logs', { params: filters });
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /audit-logs failed. Falling back to mock database.');
      let filtered = [...mockAuditLogs];
      if (filters) {
        if (filters.actorType && filters.actorType !== 'all') {
          filtered = filtered.filter(log => log.actorType === filters.actorType);
        }
        if (filters.module && filters.module !== 'all') {
          filtered = filtered.filter(log => log.targetModule === filters.module);
        }
        if (filters.action && filters.action !== 'all') {
          filtered = filtered.filter(log => log.action === filters.action);
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(
            log =>
              log.actorName.toLowerCase().includes(s) ||
              log.actorIdentifier.toLowerCase().includes(s) ||
              log.targetEntity.toLowerCase().includes(s) ||
              log.action.toLowerCase().includes(s)
          );
        }
      }
      return filtered;
    }
  },
};

export default adminAuditLogService;
