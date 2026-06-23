import api from "./api";
import { Agency, CreateAgencyPayload, UpdateAgencyPayload } from "@/types/agency.types";

export const agencyService = {
  getAll: async (): Promise<Agency[]> => {
    const response = await api.get<Agency[]>("/agencies");
    return response.data;
  },

  getById: async (id: string): Promise<Agency> => {
    const response = await api.get<Agency>(`/agencies/${id}`);
    return response.data;
  },

  create: async (payload: CreateAgencyPayload): Promise<Agency> => {
    const response = await api.post<Agency>("/agencies", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateAgencyPayload): Promise<Agency> => {
    const response = await api.patch<Agency>(`/agencies/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/agencies/${id}`);
  },
};
