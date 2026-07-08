import { AxiosError } from 'axios';
import { AppError } from '@/types/shared/api.types';

export const normalizeError = (error: unknown): AppError => {
  if (error && typeof error === 'object' && 'message' in error && 'errorCode' in error && 'statusCode' in error) {
    return error as AppError;
  }

  const appError: AppError = {
    message: 'An unexpected error occurred. Please try again.',
    errorCode: 'UNKNOWN_ERROR',
    statusCode: 500,
  };

  if (error instanceof AxiosError) {
    appError.statusCode = error.response?.status || 500;
    
    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, any>;
      
      appError.message = data.message || error.message || appError.message;
      appError.errorCode = data.errorCode || 'API_ERROR';
      
      if (Array.isArray(data.errors)) {
        const fieldErrors: Record<string, string> = {};
        data.errors.forEach((err: any) => {
          if (err && typeof err === 'object' && err.path && err.msg) {
            fieldErrors[err.path] = err.msg;
          }
        });
        appError.fieldErrors = fieldErrors;
      }
    } else {
      appError.message = error.message;
      if (error.code === 'ECONNABORTED') {
        appError.errorCode = 'TIMEOUT_ERROR';
        appError.message = 'The request timed out. Please check your connection and try again.';
      } else if (error.message === 'Network Error') {
        appError.errorCode = 'NETWORK_ERROR';
        appError.message = 'A network error occurred. Please verify your internet connection.';
      }
    }
  } else if (error instanceof Error) {
    appError.message = error.message;
  }

  return appError;
};
