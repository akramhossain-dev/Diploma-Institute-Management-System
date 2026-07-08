import { accountantAxios } from '@/lib/accountantAxios';
import { publicAxios } from '@/lib/publicAxios';
import { AccountantLoginInput } from '@/types/auth/accountant-login.schema';
import { AccountantLoginResponse, AccountantProfile } from '@/types/auth/accountant-auth.types';
import { ApiResponse } from '@/types/shared/api.types';

export const accountantAuthService = {
  login: async (credentials: AccountantLoginInput): Promise<AccountantLoginResponse['data']> => {
    const response = await publicAxios.post<AccountantLoginResponse>('/auth/accountant/login', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await accountantAxios.post<ApiResponse<null>>('/auth/accountant/logout');
  },

  fetchProfile: async (): Promise<AccountantProfile> => {
    const response = await accountantAxios.get<ApiResponse<AccountantProfile>>('/accountants/me');
    return response.data.data;
  },
};
