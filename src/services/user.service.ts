import api from "./api";
import { User, CreateUserPayload, UpdateUserPayload } from "@/types/user.types";

export const userService = {
  getAll: async (params?: { role?: string; isActive?: boolean; agencyId?: string }): Promise<User[]> => {
    const response = await api.get<User[]>("/users", { params });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const response = await api.post<User>("/users", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  resetActionPin: async (id: string): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/action-pin/reset`);
    return response.data;
  },
};
