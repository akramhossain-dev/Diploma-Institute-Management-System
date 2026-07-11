import { z } from 'zod';

export type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday';

export interface RoutineSlot {
  _id: string;
  day: DayOfWeek;
  startTime: string; 
  endTime: string; 
  departmentId: string;
  departmentName?: string;
  semesterId: string;
  semesterName?: string;
  courseId: string;
  courseName: string;
  courseCode?: string;
  teacherId: string;
  teacherName: string;
  room: string;
}

export const routineFormSchema = z.object({
  day: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'], { message: 'Day must be sunday through thursday' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  departmentId: z.string().min(1, 'Please select a department'),
  semesterId: z.string().min(1, 'Please select a semester'),
  courseId: z.string().min(1, 'Please select a course'),
  teacherId: z.string().min(1, 'Please select a teacher'),
  room: z.string().min(1, 'Room/Lab number is required'),
});

export type RoutineFormInput = z.infer<typeof routineFormSchema>;
export type CreateRoutineInput = RoutineFormInput;
export type UpdateRoutineInput = Partial<RoutineFormInput>;
export default RoutineSlot;
