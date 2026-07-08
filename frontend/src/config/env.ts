import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),
});

const parseEnv = () => {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    // In production we don't want to crash the server instantly, but in dev or during build it's useful.
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Invalid environment variables: ${JSON.stringify(result.error.format())}`);
    }
    // Fallback/defaults in case they are missing in production but needed for boot
    return {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    };
  }

  return result.data;
};

export const env = parseEnv();
