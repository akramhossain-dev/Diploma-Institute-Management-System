import { z } from 'zod';

export interface Student {
  _id: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  departmentId: string;
  departmentCode: string;
  departmentName?: string;
  semesterId: string;
  semesterName?: string;
  sessionId: string;
  sessionName?: string;
  admissionDate: string;
  photoUrl?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export const studentFormSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender option' }),
  phone: z.string().min(10, 'Phone must be at least 10 characters long'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(5, 'Address is required'),
  departmentId: z.string().min(1, 'Please select a department'),
  semesterId: z.string().min(1, 'Please select a semester'),
  sessionId: z.string().min(1, 'Please select an academic session'),
  studentId: z.string().min(3, 'Student ID index is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  photoUrl: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
});

export type StudentFormInput = z.infer<typeof studentFormSchema>;
export type CreateStudentInput = StudentFormInput;
export type UpdateStudentInput = Partial<StudentFormInput>;
export default Student;
