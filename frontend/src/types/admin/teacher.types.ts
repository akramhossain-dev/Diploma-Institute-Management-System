import { z } from 'zod';

export interface Teacher {
  _id: string;
  teacherId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  designation: string; 
  departmentId: string;
  departmentCode: string;
  departmentName?: string;
  qualification: string; 
  joiningDate: string;
  photoUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const teacherFormSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters long'),
  address: z.string().min(5, 'Address is required'),
  designation: z.string().min(2, 'Designation is required'),
  departmentId: z.string().min(1, 'Please select a department'),
  qualification: z.string().min(3, 'Qualification details are required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  teacherId: z.string().min(3, 'Teacher ID is required'),
  photoUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export type TeacherFormInput = z.infer<typeof teacherFormSchema>;
export type CreateTeacherInput = TeacherFormInput;
export type UpdateTeacherInput = Partial<TeacherFormInput>;
export default Teacher;
