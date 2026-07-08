import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AcademicSession, CreateSessionInput, UpdateSessionInput } from '@/types/admin/session.types';

let mockSessions: AcademicSession[] = [
  { _id: 'sess-1', name: '2025-2026', startYear: 2025, endYear: 2026, status: 'inactive', createdAt: '2025-06-01T00:00:00Z' },
  { _id: 'sess-2', name: '2026-2027', startYear: 2026, endYear: 2027, status: 'active', createdAt: '2026-06-01T00:00:00Z' },
];

export const adminSessionService = {
  getSessions: async (): Promise<AcademicSession[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<AcademicSession[]>>('/academic-sessions');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /academic-sessions failed. Falling back to mock data.');
      return [...mockSessions];
    }
  },

  createSession: async (data: CreateSessionInput): Promise<AcademicSession> => {
    try {
      const response = await adminAxios.post<ApiResponse<AcademicSession>>('/academic-sessions', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /academic-sessions failed. Saving to mock database.');
      
      // If we mark this one active, deactivate others
      if (data.status === 'active') {
        mockSessions = mockSessions.map(s => ({ ...s, status: 'inactive' }));
      }

      const newSess: AcademicSession = {
        _id: 'sess-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockSessions.push(newSess);
      return newSess;
    }
  },

  updateSession: async (id: string, data: UpdateSessionInput): Promise<AcademicSession> => {
    try {
      const response = await adminAxios.put<ApiResponse<AcademicSession>>(`/academic-sessions/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /academic-sessions/${id} failed. Saving to mock database.`);
      
      if (data.status === 'active') {
        mockSessions = mockSessions.map(s => ({ ...s, status: 'inactive' }));
      }

      const index = mockSessions.findIndex(s => s._id === id);
      if (index === -1) throw new Error('Academic session not found');
      const updated = { ...mockSessions[index], ...data };
      mockSessions[index] = updated;
      return updated;
    }
  },

  deleteSession: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete<ApiResponse<null>>(`/academic-sessions/${id}`);
    } catch (e) {
      console.warn(`[Admin Service] DELETE /academic-sessions/${id} failed. Deleting from mock database.`);
      mockSessions = mockSessions.filter(s => s._id !== id);
    }
  },
};
export default adminSessionService;
