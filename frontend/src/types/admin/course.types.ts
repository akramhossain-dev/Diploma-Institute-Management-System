import { z } from 'zod';

export interface Course {
  _id: string;
  name: string;
  code: string;
  departmentId: string;
  departmentName?: string;
  credits: number;
  type: 'theory' | 'practical' | 'both';
  status: 'active' | 'inactive';
  description?: string;
  createdAt: string;
}

export const courseFormSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters long'),
  code: z.string().min(3, 'Course code must be at least 3 characters long'),
  departmentId: z.string().min(1, 'Please select a department'),
  credits: z.coerce.number().min(1, 'Credits must be at least 1').max(6, 'Credits must not exceed 6'),
  type: z.enum(['theory', 'practical', 'both']),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;
export type CreateCourseInput = CourseFormInput;
export type UpdateCourseInput = Partial<CourseFormInput>;
export default Course;
