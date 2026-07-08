import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Teacher, CreateTeacherInput, UpdateTeacherInput } from '@/types/admin/teacher.types';
import { adminDepartmentService } from './department.service';

const mockTeachers: Teacher[] = [
  {
    _id: 't-1',
    teacherId: 'TCH-2024-02',
    fullName: 'Dr. Rafiqul Islam',
    email: 'rafiq@ndi.edu.bd',
    phone: '+8801755667788',
    address: 'Mirpur, Dhaka',
    designation: 'Department Head',
    departmentId: 'dept-1',
    departmentCode: 'CST',
    qualification: 'Ph.D. in Computer Science',
    joiningDate: '2024-03-01',
    photoUrl: 'https://cdn.dims.edu.bd/uploads/mock_teacher1.png',
    status: 'active',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    _id: 't-2',
    teacherId: 'TCH-2025-11',
    fullName: 'Engr. Sultana Razia',
    email: 'razia@ndi.edu.bd',
    phone: '+8801833445566',
    address: 'Uttara, Dhaka',
    designation: 'Senior Lecturer',
    departmentId: 'dept-2',
    departmentCode: 'ENT',
    qualification: 'M.Sc. in Electronics Engineering',
    joiningDate: '2025-05-10',
    status: 'active',
    createdAt: '2025-05-10T11:00:00Z',
  },
];

export const adminTeacherService = {
  getTeachers: async (): Promise<Teacher[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Teacher[]>>('/teachers');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /teachers failed. Falling back to mock data.');
      const depts = await adminDepartmentService.getDepartments();

      return mockTeachers.map(teacher => {
        const d = depts.find(dept => dept._id === teacher.departmentId || dept.code === teacher.departmentId);
        return {
          ...teacher,
          departmentName: d ? d.name : 'Unknown Technology',
          departmentCode: d ? d.code : teacher.departmentCode,
        };
      });
    }
  },

  getTeacher: async (id: string): Promise<Teacher> => {
    try {
      const response = await adminAxios.get<ApiResponse<Teacher>>(`/teachers/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /teachers/${id} failed. Searching mock database.`);
      const list = await adminTeacherService.getTeachers();
      const match = list.find(t => t._id === id);
      if (!match) throw new Error('Faculty member not found in registers.');
      return match;
    }
  },

  createTeacher: async (data: CreateTeacherInput): Promise<Teacher> => {
    try {
      const response = await adminAxios.post<ApiResponse<Teacher>>('/teachers', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /teachers failed. Saving to mock database.');
      const newTch: Teacher = {
        _id: 't-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        departmentCode: 'CST',
        createdAt: new Date().toISOString(),
      };
      mockTeachers.push(newTch);
      return newTch;
    }
  },

  updateTeacher: async (id: string, data: UpdateTeacherInput): Promise<Teacher> => {
    try {
      const response = await adminAxios.put<ApiResponse<Teacher>>(`/teachers/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /teachers/${id} failed. Saving to mock database.`);
      const index = mockTeachers.findIndex(t => t._id === id);
      if (index === -1) throw new Error('Teacher not found');
      const updated = { ...mockTeachers[index], ...data };
      mockTeachers[index] = updated as Teacher;
      return updated as Teacher;
    }
  },
};
export default adminTeacherService;
