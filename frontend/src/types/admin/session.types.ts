import { z } from 'zod';

export interface AcademicSession {
  _id: string;
  name: string; // e.g. "2026-2027"
  startYear: number;
  endYear: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const sessionFormSchema = z.object({
  name: z.string().min(4, 'Session name must be at least 4 characters long (e.g. 2026-2027)'),
  startYear: z.coerce.number().min(2000, 'Year must be after 2000').max(2100, 'Year must be before 2100'),
  endYear: z.coerce.number().min(2000, 'Year must be after 2000').max(2100, 'Year must be before 2100'),
  status: z.enum(['active', 'inactive']),
}).refine(data => data.endYear >= data.startYear, {
  message: 'End year must be equal to or greater than start year',
  path: ['endYear'],
});

export type SessionFormInput = z.infer<typeof sessionFormSchema>;
export type CreateSessionInput = SessionFormInput;
export type UpdateSessionInput = Partial<SessionFormInput>;
export default AcademicSession;
