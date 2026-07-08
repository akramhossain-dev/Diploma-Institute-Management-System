import { z } from 'zod';

export interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const departmentFormSchema = z.object({
  name: z.string().min(3, 'Department name must be at least 3 characters long'),
  code: z.string().min(2, 'Code must be at least 2 characters long').max(6, 'Code must not exceed 6 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters long'),
  status: z.enum(['active', 'inactive']),
});

export type DepartmentFormInput = z.infer<typeof departmentFormSchema>;
export type CreateDepartmentInput = DepartmentFormInput;
export type UpdateDepartmentInput = Partial<DepartmentFormInput>;
export default Department;
