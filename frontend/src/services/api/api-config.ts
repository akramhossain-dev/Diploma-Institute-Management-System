import { env } from '@/config/env';

export const API_CONFIG = {
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
};
