import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './api-config';
import { normalizeError } from './api-error';
import { useAdminAuthStore } from '@/store/auth/adminAuthStore';
import { useStudentAuthStore } from '@/store/auth/studentAuthStore';
import { useTeacherAuthStore } from '@/store/auth/teacherAuthStore';
import { useAccountantAuthStore } from '@/store/auth/accountantAuthStore';

const getAccessTokenForEntity = (entityType: string): string | null => {
  switch (entityType) {
    case 'admin':
      return useAdminAuthStore.getState().accessToken;
    case 'student':
      return useStudentAuthStore.getState().accessToken;
    case 'teacher':
      return useTeacherAuthStore.getState().accessToken;
    case 'accountant':
      return useAccountantAuthStore.getState().accessToken;
    default:
      return null;
  }
};

const updateSessionForEntity = (entityType: string, token: string, profile: any): void => {
  switch (entityType) {
    case 'admin':
      useAdminAuthStore.getState().setSession(token, profile);
      break;
    case 'student':
      useStudentAuthStore.getState().setSession(token, profile);
      break;
    case 'teacher':
      useTeacherAuthStore.getState().setSession(token, profile);
      break;
    case 'accountant':
      useAccountantAuthStore.getState().setSession(token, profile);
      break;
  }
};

const clearSessionForEntity = (entityType: string): void => {
  switch (entityType) {
    case 'admin':
      useAdminAuthStore.getState().clearSession();
      break;
    case 'student':
      useStudentAuthStore.getState().clearSession();
      break;
    case 'teacher':
      useTeacherAuthStore.getState().clearSession();
      break;
    case 'accountant':
      useAccountantAuthStore.getState().clearSession();
      break;
  }
};

const getProfileFromStore = (entityType: string): any => {
  switch (entityType) {
    case 'admin':
      return useAdminAuthStore.getState().profile;
    case 'student':
      return useStudentAuthStore.getState().profile;
    case 'teacher':
      return useTeacherAuthStore.getState().profile;
    case 'accountant':
      return useAccountantAuthStore.getState().profile;
    default:
      return null;
  }
};

const refreshRequests: Record<string, Promise<any> | null> = {
  admin: null,
  student: null,
  teacher: null,
  accountant: null,
};

export const createApiClient = (
  entityType: 'admin' | 'student' | 'teacher' | 'accountant' | 'public'
): AxiosInstance => {
  const instance = axios.create({
    ...API_CONFIG,
    withCredentials: true, // Necessary for HTTP-only refresh token cookies
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (entityType !== 'public') {
        const token = getAccessTokenForEntity(entityType);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(normalizeError(error))
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        entityType !== 'public'
      ) {
        originalRequest._retry = true;

        try {
          
          if (!refreshRequests[entityType]) {
            refreshRequests[entityType] = axios.post(
              `${API_CONFIG.baseURL}/auth/${entityType}/refresh`,
              {},
              { withCredentials: true }
            );
          }

          const refreshResponse = await refreshRequests[entityType];
          refreshRequests[entityType] = null; 

          const { accessToken, profile } = refreshResponse.data.data;
          const currentProfile = profile || getProfileFromStore(entityType);

          updateSessionForEntity(entityType, accessToken, currentProfile);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          refreshRequests[entityType] = null; 

          clearSessionForEntity(entityType);
          
          if (typeof window !== 'undefined') {
            window.location.href = `/login/${entityType}`;
          }
          
          return Promise.reject(normalizeError(refreshError));
        }
      }

      return Promise.reject(normalizeError(error));
    }
  );

  return instance;
};
