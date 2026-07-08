import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { RoutineSlot, CreateRoutineInput, UpdateRoutineInput } from '@/types/admin/routine.types';
import { adminDepartmentService } from './department.service';
import { adminSemesterService } from './semester.service';
import { adminCourseService } from './course.service';
import { adminTeacherService } from './teacher.service';

let mockRoutineSlots: RoutineSlot[] = [
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

export const adminRoutineService = {
  getRoutineSlots: async (): Promise<RoutineSlot[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<RoutineSlot[]>>('/routines');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /routines failed. Resolving mock slots.');
      const depts = await adminDepartmentService.getDepartments();
      const sems = await adminSemesterService.getSemesters();
      const courses = await adminCourseService.getCourses();
      const teachers = await adminTeacherService.getTeachers();

      return mockRoutineSlots.map(slot => {
        const d = depts.find(x => x._id === slot.departmentId || x.code === slot.departmentId);
        const sem = sems.find(x => x._id === slot.semesterId || x.number === Number(slot.semesterId));
        const c = courses.find(x => x._id === slot.courseId || x.code === slot.courseId);
        const t = teachers.find(x => x._id === slot.teacherId || x.teacherId === slot.teacherId);

        return {
          ...slot,
          departmentName: d ? d.name : 'Unknown Tech',
          semesterName: sem ? sem.name : 'Unknown Sem',
          courseName: c ? c.name : slot.courseName,
          courseCode: c ? c.code : slot.courseCode,
          teacherName: t ? t.fullName : slot.teacherName,
        };
      });
    }
  },

  createRoutineSlot: async (data: CreateRoutineInput): Promise<RoutineSlot> => {
    try {
      const response = await adminAxios.post<ApiResponse<RoutineSlot>>('/routines', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /routines failed. Saving to mock routines registry.');
      const newSlot: RoutineSlot = {
        _id: 'slot-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        courseName: 'Assigned Course',
        teacherName: 'Assigned Instructor',
      };
      mockRoutineSlots.push(newSlot);
      return newSlot;
    }
  },

  updateRoutineSlot: async (id: string, data: UpdateRoutineInput): Promise<RoutineSlot> => {
    try {
      const response = await adminAxios.put<ApiResponse<RoutineSlot>>(`/routines/${id}`, data);
      return response.data.data;
    } catch (e) {
      const index = mockRoutineSlots.findIndex(x => x._id === id);
      if (index === -1) throw new Error('Routine slot not found');
      const updated = { ...mockRoutineSlots[index], ...data };
      mockRoutineSlots[index] = updated as RoutineSlot;
      return updated as RoutineSlot;
    }
  },

  deleteRoutineSlot: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete(`/routines/${id}`);
    } catch (e) {
      mockRoutineSlots = mockRoutineSlots.filter(x => x._id !== id);
    }
  },
};
export default adminRoutineService;
