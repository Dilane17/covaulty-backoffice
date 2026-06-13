import { ChartPoint, BarChartPoint, DonutSlice } from "@/types/common";
import { DashboardAgent } from "@/types/agent";

export interface KpiStat {
  lbl: string;
  val: string;
  unit?: string;
  delta: string;
  deltaDir?: "up" | "down";
  spark: number[];
  progress?: number;
  highlight?: boolean;
  icon?: string; // lucide icon key
}

export const dashboardKpis: KpiStat[] = [
  {
    lbl: "Encaissé · jour",
    val: "4 287 500",
    unit: "F",
    delta: "▲ +18,4% vs hier",
    deltaDir: "up",
    spark: [2.8, 3.1, 2.9, 3.4, 3.6, 4.1, 4.3],
    progress: 84,
    icon: "ArrowUp",
  },
  {
    lbl: "Dépôts",
    val: "312",
    delta: "▲ +22 vs hier",
    deltaDir: "up",
    spark: [240, 268, 255, 281, 290, 304, 312],
    progress: 78,
    icon: "List",
  },
  {
    lbl: "Agents sur le terrain",
    val: "18",
    unit: "/22",
    delta: "▲ +2 vs hier",
    deltaDir: "up",
    spark: [14, 15, 16, 15, 17, 16, 18],
    progress: 82,
    icon: "Users",
  },
  {
    lbl: "Taux de recouvrement",
    val: "94,2",
    unit: "%",
    delta: "▲ +3,1 pts vs hier",
    deltaDir: "up",
    spark: [88, 90, 89, 91, 92, 93, 94.2],
    progress: 94,
    icon: "Chart",
  },
  {
    lbl: "Nouveaux clients",
    val: "7",
    delta: "▲ +3 vs hier",
    deltaDir: "up",
    spark: [3, 2, 5, 4, 6, 4, 7],
    progress: 70,
    icon: "User",
  },
  {
    lbl: "Écart de caisse",
    val: "0",
    unit: "F",
    delta: "100% réconcilié",
    deltaDir: "up",
    spark: [0, 0, 0, 0, 0, 0, 0],
    highlight: true,
    icon: "Shield",
  },
];

export const dashboardZones: DonutSlice[] = [
  { l: "Akpakpa", v: 38, c: "var(--primary)" },
  { l: "Cotonou", v: 27, c: "var(--accent)" },
  { l: "Sèmè-Kpodji", v: 19, c: "var(--warn)" },
  { l: "Adjarra", v: 16, c: "var(--carbon)" },
];

export interface DashboardAlert {
  level: "crit" | "warn";
  kind: string;
  title: string;
  ago: string;
}

export const dashboardAlerts: DashboardAlert[] = [
  {
    level: "crit",
    kind: "Écart de caisse",
    title: "Écart de 3 500 F — Agent Boris K.",
    ago: "il y a 3 min",
  },
  {
    level: "warn",
    kind: "Hors-zone",
    title: "Jean M. détecté hors de sa zone assignée",
    ago: "il y a 18 min",
  },
  {
    level: "warn",
    kind: "Double collecte",
    title: "Possible doublon — M. Adjovi K. à 09:12",
    ago: "il y a 1 h",
  },
];

export const dashboardChartData: ChartPoint[] = [
  { x: "Lun", y: 1.8, tip: "1,8 M F" },
  { x: "Mar", y: 2.1, tip: "2,1 M F" },
  { x: "Mer", y: 2.6, tip: "2,6 M F" },
  { x: "Jeu", y: 2.4, tip: "2,4 M F" },
  { x: "Ven", y: 3.2, tip: "3,2 M F" },
  { x: "Sam", y: 4.1, tip: "4,1 M F" },
  { x: "Auj", y: 4.3, tip: "4,3 M F" },
];

/* NEW: Dépôts vs Retraits — données BarChart */
export const dashboardBarData: BarChartPoint[] = [
  { x: "Lun", y1: 1.8, y2: 0.4 },
  { x: "Mar", y1: 2.1, y2: 0.6 },
  { x: "Mer", y1: 2.6, y2: 0.5 },
  { x: "Jeu", y1: 2.4, y2: 0.7 },
  { x: "Ven", y1: 3.2, y2: 0.9 },
  { x: "Sam", y1: 4.1, y2: 0.3 },
  { x: "Auj", y1: 4.3, y2: 0.2 },
];

/* NEW: Résumé financier rapide */
export interface FinanceSummary {
  label: string;
  value: string;
  sub: string;
}

export const dashboardFinanceSummary: FinanceSummary[] = [
  { label: "Solde portefeuille", value: "128,4 M", sub: "F CFA · consolidé" },
  { label: "Objectif jour", value: "5,1 M", sub: "F CFA · reste 812 500 F" },
  { label: "Montant moyen", value: "13 741", sub: "F CFA · par dépôt" },
  { label: "Clients actifs", value: "1 247", sub: "sur 1 389 inscrits" },
];

/* NEW: Zone activity heatmap data */
export interface ZoneActivity {
  name: string;
  agents: number;
  totalAgents: number;
  collecte: string;
  pct: number;
  color: string;
}

export const dashboardZoneActivity: ZoneActivity[] = [
  { name: "Akpakpa", agents: 7, totalAgents: 8, collecte: "1,63 M F", pct: 38, color: "var(--primary)" },
  { name: "Cotonou", agents: 5, totalAgents: 6, collecte: "1,16 M F", pct: 27, color: "var(--accent)" },
  { name: "Sèmè-Kpodji", agents: 4, totalAgents: 5, collecte: "815 K F", pct: 19, color: "var(--warn)" },
  { name: "Adjarra", agents: 2, totalAgents: 3, collecte: "686 K F", pct: 16, color: "var(--carbon)" },
];

export interface StreamItem {
  i: string;
  n: string;
  z: string;
  who: string;
  t: string;
  a: string;
  isNew?: boolean;
  isAccent?: boolean;
}

export const dashboardStream: StreamItem[] = [
  {
    i: "KA",
    n: "Dépôt · M. Adjovi",
    z: "Akpakpa",
    who: "Koffi A.",
    t: "il y a 12 s",
    a: "+2 000 F",
    isNew: true,
    isAccent: true,
  },
  {
    i: "AB",
    n: "Dépôt · Mme Hounkpati",
    z: "Akpakpa",
    who: "Adèle B.",
    t: "il y a 1 min",
    a: "+5 000 F",
    isAccent: true,
  },
  {
    i: "SP",
    n: "KYC validé · Nouveau client",
    z: "Sèmè-Kpodji",
    who: "Sètondji P.",
    t: "il y a 2 min",
    a: "—",
  },
  {
    i: "KA",
    n: "Dépôt · M. Codjo",
    z: "Akpakpa",
    who: "Koffi A.",
    t: "il y a 4 min",
    a: "+1 500 F",
    isAccent: true,
  },
  {
    i: "RT",
    n: "Dépôt · Mme Yovo",
    z: "Adjarra",
    who: "Rachelle T.",
    t: "il y a 6 min",
    a: "+4 000 F",
    isAccent: true,
  },
];

export const dashboardAgents: DashboardAgent[] = [
  { i: "KA", n: "Koffi A.", z: "Akpakpa T1", d: 23, c: 47250, o: 92, st: "ok" },
  { i: "AB", n: "Adèle B.", z: "Cotonou T3", d: 19, c: 38400, o: 78, st: "ok" },
  {
    i: "SP",
    n: "Sètondji P.",
    z: "Sèmè-Kpodji",
    d: 16,
    c: 31200,
    o: 66,
    st: "ok",
  },
  {
    i: "RT",
    n: "Rachelle T.",
    z: "Adjarra T2",
    d: 21,
    c: 42100,
    o: 85,
    st: "ok",
  },
  { i: "BK", n: "Boris K.", z: "Ouando T4", d: 8, c: 14200, o: 32, st: "off" },
];

/* Sparklines par agent pour la colonne tendance */
export const agentSparklines: Record<string, number[]> = {
  "KA": [32000, 38000, 41000, 44000, 43000, 46000, 47250],
  "AB": [28000, 31000, 35000, 33000, 36000, 37000, 38400],
  "SP": [22000, 25000, 27000, 29000, 28000, 30000, 31200],
  "RT": [30000, 34000, 37000, 39000, 40000, 41000, 42100],
  "BK": [18000, 16000, 14000, 15000, 12000, 13000, 14200],
};
