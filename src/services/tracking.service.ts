import api from "./api";

export interface AgentLocationHistory {
  latitude: number;
  longitude: number;
  timestamp: string;
  batteryLevel?: number;
}

export const trackingService = {
  getHistory: async (agentId: string, date: string): Promise<AgentLocationHistory[]> => {
    const response = await api.get<AgentLocationHistory[]>(`/tracking/agents/${agentId}/history`, {
      params: { date },
    });
    return response.data;
  },
};
