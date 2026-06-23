import api from "./api";
import { Client, CreateClientPayload, AdjustBalancePayload } from "@/types/client.types";

export const clientService = {
  getAll: async (params?: { search?: string; status?: string; agencyId?: string }): Promise<Client[]> => {
    const response = await api.get<Client[]>("/clients", { params });
    return response.data;
  },

  create: async (payload: CreateClientPayload): Promise<Client> => {
    const response = await api.post<Client>("/clients", payload);
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  adjustBalance: async (id: string, payload: AdjustBalancePayload, pin: string): Promise<void> => {
    await api.post(`/clients/${id}/adjust-balance`, payload, {
      headers: { "x-action-pin": pin }
    });
  },
};
