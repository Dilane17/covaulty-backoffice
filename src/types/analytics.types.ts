export interface DashboardMetrics {
  totalCollectes?: number;
  totalRetraits?: number;
  totalRemises?: number;
  totalPrets?: number;
  nbPrets?: number;
  clients?: number;
  agents?: number;
  [key: string]: any;
}

export interface RankData {
  agentId: string;
  agentName: string;
  collected: number;
  withdrawn: number;
  [key: string]: any;
}

export interface AnalyticsResponse<T> {
  data: T;
  meta?: any;
}
