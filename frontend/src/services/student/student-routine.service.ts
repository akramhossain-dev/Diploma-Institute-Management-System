import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { RoutineSlot } from '@/types/admin/routine.types';

const mockStudentRoutineSlots: RoutineSlot[] = [
  {
    _id: 'slot-1',
    day: 'sunday',
    startTime: '09:00',
    endTime: '10:00',
    departmentId: 'dept-1',
    semesterId: 'sem-3',
    courseId: 'course-1',
    courseName: 'Computer Fundamentals',
    courseCode: 'CST-101',
    teacherId: 't-1',
    teacherName: 'Dr. Rafiqul Islam',
    room: 'Room 302',
  },
  {
    _id: 'slot-2',
    day: 'monday',
    startTime: '10:30',
    endTime: '12:00',
    departmentId: 'dept-1',
    semesterId: 'sem-3',
    courseId: 'course-2',
    courseName: 'Electronic Circuits',
    courseCode: 'ENT-201',
    teacherId: 't-2',
    teacherName: 'Engr. Sultana Razia',
    room: 'Lab 1',
  },
];

export const studentRoutineService = {
  getRoutine: async (): Promise<RoutineSlot[]> => {
    try {
      const response = await studentAxios.get<ApiResponse<RoutineSlot[]>>('/routine/my');
      return response.data.data;
    } catch {
      console.warn('[Student Service] GET /routine/my failed. Resolving active mock routine.');
      return [...mockStudentRoutineSlots];
    }
  },
};
export default studentRoutineService;
