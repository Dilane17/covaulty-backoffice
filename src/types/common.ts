export type Status = "ok" | "sync" | "admin" | "warn" | "off" | "ofl" | "on";

export interface ChartPoint {
  x: string;
  y: number;
  tip?: string;
}

export interface BarChartPoint {
  x: string;
  y1: number;
  y2?: number;
}

export interface ForecastPoint {
  x: string;
  y: number;
  band?: number;
}

export interface DonutSlice {
  l: string;
  v: number;
  c: string;
}

export type RouteId =
  | "login"
  | "dashboard"
  | "map"
  | "collectes"
  | "transactions"
  | "alertes"
  | "agents"
  | "clients"
  | "agences"
  | "rapports"
  | "liquidite"
  | "bceao"
  | "settings"
  | "profil";
