import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Student, CreateStudentInput, UpdateStudentInput } from '@/types/admin/student.types';
import { adminDepartmentService } from './department.service';
import { adminSemesterService } from './semester.service';
import { adminSessionService } from './session.service';

let mockStudents: Student[] = [
  {
    _id: 's-1',
    studentId: 'CST-2026-001',
    fullName: 'Akram Hossain',
    dateOfBirth: '2005-05-15',
    gender: 'male',
    phone: '+8801711122233',
    email: 'akram@gmail.com',
    address: 'Adabor, Dhaka',
    departmentId: 'dept-1',
    departmentCode: 'CST',
    semesterId: 'sem-3',
    sessionId: 'sess-2',
    admissionDate: '2026-01-10',
    photoUrl: 'https://cdn.dims.edu.bd/uploads/mock_student1.png',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    _id: 's-2',
    studentId: 'ENT-2026-005',
    fullName: 'Sara Khan',
    dateOfBirth: '2005-11-22',
    gender: 'female',
    phone: '+8801933445566',
    email: 'sara@domain.com',
    address: 'Banani, Dhaka',
    departmentId: 'dept-2',
    departmentCode: 'ENT',
    semesterId: 'sem-3',
    sessionId: 'sess-2',
    admissionDate: '2026-01-12',
    status: 'active',
    createdAt: '2026-01-12T12:00:00Z',
  },
];

export const adminStudentService = {
  getStudents: async (): Promise<Student[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Student[]>>('/students');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /students failed. Falling back to mock data.');
      // Resolve departments, semesters, and sessions dynamically from services mock state
      const depts = await adminDepartmentService.getDepartments();
      const sems = await adminSemesterService.getSemesters();
      const sess = await adminSessionService.getSessions();

      return mockStudents.map(student => {
        const d = depts.find(dept => dept._id === student.departmentId || dept.code === student.departmentId);
        const sem = sems.find(s => s._id === student.semesterId || s.number === Number(student.semesterId));
        const ses = sess.find(s => s._id === student.sessionId || s.name === student.sessionId);

        return {
          ...student,
          departmentName: d ? d.name : 'Unknown Technology',
          departmentCode: d ? d.code : student.departmentCode,
          semesterName: sem ? sem.name : 'Unknown Semester',
          sessionName: ses ? ses.name : 'Unknown Session',
        };
      });
    }
  },

  getStudent: async (id: string): Promise<Student> => {
    try {
      const response = await adminAxios.get<ApiResponse<Student>>(`/students/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /students/${id} failed. Searching mock database.`);
      const list = await adminStudentService.getStudents();
      const match = list.find(s => s._id === id);
      if (!match) throw new Error('Student not found in system registers.');
      return match;
    }
  },

  createStudent: async (data: CreateStudentInput): Promise<Student> => {
    try {
      const response = await adminAxios.post<ApiResponse<Student>>('/students', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /students failed. Saving to mock database.');
      const newStud: Student = {
        _id: 's-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        departmentCode: 'CST',
        createdAt: new Date().toISOString(),
      };
      mockStudents.push(newStud);
      return newStud;
    }
  },

  updateStudent: async (id: string, data: UpdateStudentInput): Promise<Student> => {
    try {
      const response = await adminAxios.put<ApiResponse<Student>>(`/students/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /students/${id} failed. Saving to mock database.`);
      const index = mockStudents.findIndex(s => s._id === id);
      if (index === -1) throw new Error('Student not found');
      const updated = { ...mockStudents[index], ...data };
      mockStudents[index] = updated as Student;
      return updated as Student;
    }
  },
};
export default adminStudentService;
