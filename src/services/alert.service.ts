import api from "./api";
import { Alert } from "@/types/alert.types";

export const alertService = {
  getAlerts: async (status?: string): Promise<Alert[]> => {
    const response = await api.get<Alert[]>("/alerts", { params: { status } });
    return response.data;
  },

  resolveAlert: async (id: string): Promise<Alert> => {
    const response = await api.patch<Alert>(`/alerts/${id}/resolve`);
    return response.data;
  },
};
