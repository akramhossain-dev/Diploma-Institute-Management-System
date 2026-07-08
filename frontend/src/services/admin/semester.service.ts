import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Semester, CreateSemesterInput, UpdateSemesterInput } from '@/types/admin/semester.types';

let mockSemesters: Semester[] = [
  { _id: 'sem-1', name: '1st Semester', number: 1, durationMonths: 6, status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'sem-2', name: '2nd Semester', number: 2, durationMonths: 6, status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'sem-3', name: '3rd Semester', number: 3, durationMonths: 6, status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'sem-4', name: '4th Semester', number: 4, durationMonths: 6, status: 'active', createdAt: '2026-06-01T00:00:00Z' },
];

export const adminSemesterService = {
  getSemesters: async (): Promise<Semester[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Semester[]>>('/semesters');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /semesters failed. Falling back to mock data.');
      return [...mockSemesters];
    }
  },

  createSemester: async (data: CreateSemesterInput): Promise<Semester> => {
    try {
      const response = await adminAxios.post<ApiResponse<Semester>>('/semesters', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /semesters failed. Saving to mock database.');
      const newSem: Semester = {
        _id: 'sem-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockSemesters.push(newSem);
      return newSem;
    }
  },

  updateSemester: async (id: string, data: UpdateSemesterInput): Promise<Semester> => {
    try {
      const response = await adminAxios.put<ApiResponse<Semester>>(`/semesters/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /semesters/${id} failed. Saving to mock database.`);
      const index = mockSemesters.findIndex(s => s._id === id);
      if (index === -1) throw new Error('Semester not found');
      const updated = { ...mockSemesters[index], ...data };
      mockSemesters[index] = updated;
      return updated;
    }
  },

  deleteSemester: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete<ApiResponse<null>>(`/semesters/${id}`);
    } catch (e) {
      console.warn(`[Admin Service] DELETE /semesters/${id} failed. Deleting from mock database.`);
      mockSemesters = mockSemesters.filter(s => s._id !== id);
    }
  },
};
export default adminSemesterService;
