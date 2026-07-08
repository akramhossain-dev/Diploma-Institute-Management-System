import { z } from 'zod';

export const studentLoginSchema = z.object({
  email: z.string().email('Please enter a valid student email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
