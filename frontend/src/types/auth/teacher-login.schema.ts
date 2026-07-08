import { z } from 'zod';

export const teacherLoginSchema = z.object({
  email: z.string().email('Please enter a valid faculty email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type TeacherLoginInput = z.infer<typeof teacherLoginSchema>;
