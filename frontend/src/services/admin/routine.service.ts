import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { RoutineSlot, CreateRoutineInput, UpdateRoutineInput } from '@/types/admin/routine.types';

export const adminRoutineService = {
  getRoutineSlots: async (): Promise<RoutineSlot[]> => {
    const response = await adminAxios.get<ApiResponse<RoutineSlot[]>>('/class-routines');
    return response.data.data;
  },

  createRoutineSlot: async (data: CreateRoutineInput): Promise<RoutineSlot> => {
    const response = await adminAxios.post<ApiResponse<RoutineSlot>>('/class-routines', data);
    return response.data.data;
  },

  updateRoutineSlot: async (id: string, data: UpdateRoutineInput): Promise<RoutineSlot> => {
    const response = await adminAxios.put<ApiResponse<RoutineSlot>>(`/class-routines/${id}`, data);
    return response.data.data;
  },

  deleteRoutineSlot: async (id: string): Promise<void> => {
    await adminAxios.delete(`/class-routines/${id}`);
  },
};
export default adminRoutineService;
