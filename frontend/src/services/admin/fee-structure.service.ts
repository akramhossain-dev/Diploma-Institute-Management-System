import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { FeeStructure, CreateFeeStructureInput, UpdateFeeStructureInput } from '@/types/admin/fee-structure.types';
import { adminSemesterService } from './semester.service';
import { adminSessionService } from './session.service';
import { adminDepartmentService } from './department.service';

let mockFeeStructures: FeeStructure[] = [
  {
    _id: 'fee-1',
    name: 'Admission Fee 2026',
    departmentId: 'dept-1',
    semesterId: 'sem-3',
    sessionId: 'sess-2',
    amount: 15000,
    dueDate: '2026-07-30',
    description: 'General admission fee for the session.',
    status: 'active',
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    _id: 'fee-2',
    name: 'Semester Exam Fee 2026',
    departmentId: '', // All depts
    semesterId: '', // All semesters
    sessionId: 'sess-2',
    amount: 3000,
    dueDate: '2026-08-15',
    description: 'Exam fee for semester final.',
    status: 'active',
    createdAt: '2026-07-02T10:00:00Z',
  },
];

export const adminFeeStructureService = {
  getFeeStructures: async (): Promise<FeeStructure[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<FeeStructure[]>>('/fees/structures');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /fees/structures failed. Resolving mock bindings.');
      const sems = await adminSemesterService.getSemesters().catch(() => []);
      const sessions = await adminSessionService.getSessions().catch(() => []);
      const depts = await adminDepartmentService.getDepartments().catch(() => []);

      return mockFeeStructures.map(item => {
        const sem = sems.find(x => x._id === item.semesterId);
        const ses = sessions.find(x => x._id === item.sessionId);
        const dept = depts.find(x => x._id === item.departmentId);

        return {
          ...item,
          semesterName: sem ? sem.name : (item.semesterId ? 'Unknown Sem' : 'All Semesters'),
          sessionName: ses ? ses.name : 'Unknown Session',
          departmentName: dept ? dept.name : (item.departmentId ? 'Unknown Dept' : 'All Departments'),
        };
      });
    }
  },

  getFeeStructure: async (id: string): Promise<FeeStructure> => {
    try {
      const response = await adminAxios.get<ApiResponse<FeeStructure>>(`/fees/structures/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /fees/structures/${id} failed. Searching mock registry.`);
      const list = await adminFeeStructureService.getFeeStructures();
      const match = list.find(x => x._id === id);
      if (!match) throw new Error('Fee structure not found.');
      return match;
    }
  },

  createFeeStructure: async (data: CreateFeeStructureInput): Promise<FeeStructure> => {
    try {
      const response = await adminAxios.post<ApiResponse<FeeStructure>>('/fees/structures', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /fees/structures failed. Saving to mock database.');
      const newFee: FeeStructure = {
        _id: 'fee-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockFeeStructures.push(newFee);
      return newFee;
    }
  },

  updateFeeStructure: async (id: string, data: UpdateFeeStructureInput): Promise<FeeStructure> => {
    try {
      const response = await adminAxios.put<ApiResponse<FeeStructure>>(`/fees/structures/${id}`, data);
      return response.data.data;
    } catch (e) {
      const index = mockFeeStructures.findIndex(x => x._id === id);
      if (index === -1) throw new Error('Fee structure not found');
      const updated = { ...mockFeeStructures[index], ...data };
      mockFeeStructures[index] = updated as FeeStructure;
      return updated as FeeStructure;
    }
  },

  deleteFeeStructure: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete(`/fees/structures/${id}`);
    } catch (e) {
      mockFeeStructures = mockFeeStructures.filter(x => x._id !== id);
    }
  },
};

export default adminFeeStructureService;
