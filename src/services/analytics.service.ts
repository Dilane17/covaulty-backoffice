import api from "./api";
import { DashboardMetrics, RankData, AnalyticsResponse } from "@/types/analytics.types";

export const analyticsService = {
  getPlatformDashboard: async (): Promise<AnalyticsResponse<any> | any> => {
    const res = await api.get("/analytics/platform-dashboard");
    return res.data;
  },
  
  getDashboard: async (): Promise<AnalyticsResponse<DashboardMetrics> | DashboardMetrics> => {
    const res = await api.get("/analytics/dashboard");
    return res.data;
  },
  
  getRanking: async (): Promise<AnalyticsResponse<RankData[]> | RankData[]> => {
    const res = await api.get("/analytics/ranking");
    return res.data;
  },
  
  getForecast: async (agencyId?: string): Promise<any> => {
    const url = agencyId ? `/analytics/forecast?agencyId=${agencyId}` : "/analytics/forecast";
    const res = await api.get(url);
    return res.data;
  },
  
  exportTransactions: async (startDate?: string, endDate?: string): Promise<Blob> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    
    const url = `/analytics/exports/transactions${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await api.get(url, { responseType: "blob" });
    return res.data;
  }
};
