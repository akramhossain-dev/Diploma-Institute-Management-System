import { QueryClient } from '@tanstack/react-query';
import { AppError } from '@/types/shared/api.types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (garbage collection time)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        // Do not retry for client-side failures (4xx) or forbidden actions
        const appError = error as unknown as AppError;
        if (appError && (appError.statusCode === 400 || appError.statusCode === 401 || appError.statusCode === 403 || appError.statusCode === 404)) {
          return false;
        }
        return failureCount < 1; // Retry once for server errors or network errors
      },
    },
    mutations: {
      retry: false, // Do not retry mutation operations automatically
    },
  },
});
