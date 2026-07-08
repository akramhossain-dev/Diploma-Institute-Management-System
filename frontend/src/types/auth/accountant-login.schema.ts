import { z } from 'zod';

export const accountantLoginSchema = z.object({
  email: z.string().email('Please enter a valid accountant email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type AccountantLoginInput = z.infer<typeof accountantLoginSchema>;
