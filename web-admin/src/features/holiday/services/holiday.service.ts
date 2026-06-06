import axiosClient from "../../../config/axios";
import type { ApiResponse } from "../../../types/api.type";
import type { Holiday, HolidayPayload } from "../types/holiday.type";

export const HolidayService = {
  getAllHolidays: async () => {
    return await axiosClient.get<any, ApiResponse<Holiday[]>>("/admin/holidays");
  },

  createHoliday: async (payload: HolidayPayload) => {
    return await axiosClient.post<any, ApiResponse<Holiday>>("/admin/holidays", payload);
  },

  // Sửa thì có thể gửi lên một phần dữ liệu (Partial)
  updateHoliday: async (id: number, payload: Partial<HolidayPayload>) => {
    return await axiosClient.put<any, ApiResponse<Holiday>>(`/admin/holidays/${id}`, payload);
  },

  deleteHoliday: async (id: number) => {
    return await axiosClient.delete<any, ApiResponse<any>>(`/admin/holidays/${id}`);
  },
};