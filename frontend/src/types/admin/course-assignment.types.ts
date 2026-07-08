import { z } from 'zod';

export interface CourseAssignment {
  _id: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseName: string;
  departmentId: string;
  departmentName?: string;
  semesterId: string;
  semesterName?: string;
  sessionId: string;
  sessionName?: string;
  assignedDate: string;
  status: 'active' | 'inactive';
}

export const courseAssignmentSchema = z.object({
  teacherId: z.string().min(1, 'Please select a teacher'),
  departmentId: z.string().min(1, 'Please select a department'),
  courseId: z.string().min(1, 'Please select a course'),
  semesterId: z.string().min(1, 'Please select a semester'),
  sessionId: z.string().min(1, 'Please select an academic session'),
  status: z.enum(['active', 'inactive']),
});

export type CourseAssignmentFormInput = z.infer<typeof courseAssignmentSchema>;
export type CreateAssignmentInput = CourseAssignmentFormInput;
export type UpdateAssignmentInput = Partial<CourseAssignmentFormInput>;
export default CourseAssignment;
