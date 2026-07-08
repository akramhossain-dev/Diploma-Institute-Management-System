import { z } from 'zod';

export interface Semester {
  _id: string;
  name: string;
  number: number;
  durationMonths: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const semesterFormSchema = z.object({
  name: z.string().min(3, 'Semester name must be at least 3 characters long'),
  number: z.coerce.number().min(1, 'Number must be at least 1').max(12, 'Number must not exceed 12'),
  durationMonths: z.coerce.number().min(1, 'Duration must be at least 1 month').max(12, 'Duration must not exceed 12 months'),
  status: z.enum(['active', 'inactive']),
});

export type SemesterFormInput = z.infer<typeof semesterFormSchema>;
export type CreateSemesterInput = SemesterFormInput;
export type UpdateSemesterInput = Partial<SemesterFormInput>;
export default Semester;
