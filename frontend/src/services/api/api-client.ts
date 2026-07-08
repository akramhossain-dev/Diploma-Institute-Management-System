import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './api-config';
import { normalizeError } from './api-error';

export const createApiClient = (
  entityType: 'admin' | 'student' | 'teacher' | 'accountant' | 'public'
): AxiosInstance => {
  const instance = axios.create({
    ...API_CONFIG,
    withCredentials: true, // Necessary for HTTP-only cookies (refresh token)
  });

  // Request interceptor placeholder for token injection
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // [Future implementation in Phase F2]:
      // 1. Check entity type and load the correct Zustand auth store
      // 2. Extract access token
      // 3. Set config.headers.Authorization = `Bearer ${token}`
      
      // Placeholder log to verify instance usage
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Request] Scoped to: ${entityType} -> ${config.url}`);
      }
      
      return config;
    },
    (error) => Promise.reject(normalizeError(error))
  );

  // Response interceptor placeholder for token refresh & normalized error forwarding
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Check for 401 Unauthorized status (session expired)
      if (error.response?.status === 401 && !originalRequest?._retry && entityType !== 'public') {
        originalRequest._retry = true;
        
        // [Future implementation in Phase F2]:
        // 1. Call POST /api/auth/{entityType}/refresh to get new access token
        // 2. Save token to Zustand store
        // 3. Retry original request with new Authorization header
        
        console.warn(`[API Auth] 401 detected for entity ${entityType}. Silent refresh is required.`);
      }

      // Always return normalized error object for easy UI mapping
      return Promise.reject(normalizeError(error));
    }
  );

  return instance;
};
