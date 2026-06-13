export interface AgentTransaction {
  d: string;
  c: string;
  m: number;
}

export interface Agent {
  i: string;
  n: string;
  z: string;
  tel: string;
  em: string;
  d: number;
  c: number;
  o: number;
  s: "on" | "off" | "ofl";
  rt: number;
  dj: number;
  dn: string;
  spark: number[];
  device: string;
  lastSync: string;
  alerts30d: number;
  weeklyData: { x: string; y: number }[];
  transactions: AgentTransaction[];
}

export interface MapTourneeStop {
  lng: number;
  lat: number;
  n: number;
}

export interface MapAgent {
  i: string;
  n: string;
  z: string;
  last: string;
  c: number;
  st: "on" | "off" | "ofl";
  deps: number;
  obj: number;
  lng: number;
  lat: number;
  label: string;
  lastPos: string;
  tournee: MapTourneeStop[];
}

export interface DashboardAgent {
  i: string;
  n: string;
  z: string;
  d: number;
  c: number;
  o: number;
  st: "ok" | "off";
}
