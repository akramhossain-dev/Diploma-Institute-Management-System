import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Course } from '@/types/admin/course.types';
import { Student } from '@/types/admin/student.types';

// Mock list of assigned courses to the active teacher session
const mockAssignedCourses: Course[] = [
  {
    _id: 'course-1',
    name: 'Computer Fundamentals',
    code: 'CST-101',
    departmentId: 'dept-1',
    departmentName: 'Computer Technology',
    credits: 3,
    type: 'both',
    status: 'active',
    createdAt: '2026-07-01T10:00:00Z',
  },
];

const mockCourseStudents: Record<string, Student[]> = {
  'course-1': [
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
      departmentName: 'Computer Technology',
      semesterId: 'sem-3',
      semesterName: '3rd Semester',
      sessionId: 'sess-2',
      sessionName: '2026-2027',
      admissionDate: '2026-01-10',
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
      departmentId: 'dept-1',
      departmentCode: 'CST',
      departmentName: 'Computer Technology',
      semesterId: 'sem-3',
      semesterName: '3rd Semester',
      sessionId: 'sess-2',
      sessionName: '2026-2027',
      admissionDate: '2026-01-12',
      status: 'active',
      createdAt: '2026-01-12T12:00:00Z',
    },
  ],
};

export const teacherCourseService = {
  getAssignedCourses: async (): Promise<Course[]> => {
    try {
      const response = await teacherAxios.get<ApiResponse<Course[]>>('/courses/assigned');
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },

  getCourseStudents: async (courseId: string): Promise<Student[]> => {
    try {
      const response = await teacherAxios.get<ApiResponse<Student[]>>(`/courses/${courseId}/students`);
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },
};
export default teacherCourseService;
