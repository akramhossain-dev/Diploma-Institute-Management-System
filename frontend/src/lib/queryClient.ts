import { QueryClient } from '@tanstack/react-query';
import { AppError } from '@/types/shared/api.types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      gcTime: 1000 * 60 * 10,   
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        
        const appError = error as unknown as AppError;
        if (appError && (appError.statusCode === 400 || appError.statusCode === 401 || appError.statusCode === 403 || appError.statusCode === 404)) {
          return false;
        }
        return failureCount < 1; 
      },
    },
    mutations: {
      retry: false, 
    },
  },
});
