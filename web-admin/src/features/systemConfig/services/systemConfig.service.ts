import axiosClient from "../../../config/axios";
import type { ApiResponse } from "../../../types/api.type";
import type { SystemConfig, CreateSystemConfigPayload, UpdateSystemConfigPayload } from "../types/systemConfig.type";

export const SystemConfigService = {
  getAllConfigs: async () => {
    return await axiosClient.get<any, ApiResponse<SystemConfig[]>>("/admin/system-configs");
  },

  createConfig: async (payload: CreateSystemConfigPayload) => {
    return await axiosClient.post<any, ApiResponse<SystemConfig>>("/admin/system-configs", payload);
  },

  updateConfig: async (id: number, payload: UpdateSystemConfigPayload) => {
    return await axiosClient.put<any, ApiResponse<SystemConfig>>(`/admin/system-configs/${id}`, payload);
  },

  deleteConfig: async (id: number) => {
    return await axiosClient.delete<any, ApiResponse<any>>(`/admin/system-configs/${id}`);
  },
};