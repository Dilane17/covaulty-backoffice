import api from "./api";
import { 
  CollectionTransaction, 
  CreateCollectionPayload, 
  Schedule, 
  CreateSchedulePayload, 
  UpdateSchedulePayload 
} from "@/types/collection.types";

export const collectionService = {
  createTransaction: async (payload: CreateCollectionPayload): Promise<CollectionTransaction> => {
    const response = await api.post<CollectionTransaction>("/collection/transactions", payload);
    return response.data;
  },

  getTransactions: async (params?: { clientId?: string; agentId?: string; type?: string }): Promise<CollectionTransaction[]> => {
    const response = await api.get<CollectionTransaction[]>("/collection/transactions", { params });
    return response.data;
  },

  getTransactionById: async (id: string): Promise<CollectionTransaction> => {
    const response = await api.get<CollectionTransaction>(`/collection/transactions/${id}`);
    return response.data;
  },

  createSchedule: async (payload: CreateSchedulePayload): Promise<Schedule> => {
    const response = await api.post<Schedule>("/collection/schedules", payload);
    return response.data;
  },

  getSchedules: async (): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>("/collection/schedules");
    return response.data;
  },

  updateSchedule: async (id: string, payload: UpdateSchedulePayload): Promise<Schedule> => {
    const response = await api.patch<Schedule>(`/collection/schedules/${id}`, payload);
    return response.data;
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await api.delete(`/collection/schedules/${id}`);
  },
};
