import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AcademicSession, CreateSessionInput, UpdateSessionInput } from '@/types/admin/session.types';

export const adminSessionService = {
  getSessions: async (): Promise<AcademicSession[]> => {
    const response = await adminAxios.get<ApiResponse<AcademicSession[]>>('/academic-sessions');
    return response.data.data;
  },

  createSession: async (data: CreateSessionInput): Promise<AcademicSession> => {
    const response = await adminAxios.post<ApiResponse<AcademicSession>>('/academic-sessions', data);
    return response.data.data;
  },

  updateSession: async (id: string, data: UpdateSessionInput): Promise<AcademicSession> => {
    const response = await adminAxios.put<ApiResponse<AcademicSession>>(`/academic-sessions/${id}`, data);
    return response.data.data;
  },

  deleteSession: async (id: string): Promise<void> => {
    await adminAxios.delete<ApiResponse<null>>(`/academic-sessions/${id}`);
  },
};
export default adminSessionService;
