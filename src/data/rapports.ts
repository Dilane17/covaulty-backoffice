import { BarChartPoint, DonutSlice } from "@/types/common";

export const rapportsMonthsData: BarChartPoint[] = [
  { x: "Jan", y1: 1.8, y2: 0.3  },
  { x: "Fév", y1: 2.0, y2: 0.32 },
  { x: "Mar", y1: 2.1, y2: 0.28 },
  { x: "Avr", y1: 2.3, y2: 0.40 },
  { x: "Mai", y1: 2.4, y2: 0.35 },
  { x: "Juin",y1: 2.5, y2: 0.30 },
  { x: "Juil",y1: 2.4, y2: 0.36 },
  { x: "Aoû", y1: 2.6, y2: 0.42 },
  { x: "Sep", y1: 2.5, y2: 0.34 },
  { x: "Oct", y1: 2.7, y2: 0.45 },
  { x: "Nov", y1: 2.8, y2: 0.41 },
  { x: "Déc", y1: 2.85,y2: 0.45 },
];

export const rapportsDonutData: DonutSlice[] = [
  { l: "Akpakpa", v: 43.8, c: "#B3001B" },
  { l: "Cotonou", v: 24.0, c: "#C91229" },
  { l: "Adjarra", v: 20.6, c: "#E58A95" },
  { l: "Sèmè",    v: 18.4, c: "#F2C5CB" },
  { l: "Autres",  v: 13.2, c: "#F9E2E6" },
];

export interface RapportAgence {
  n: string;
  a: number;
  d: number;
  c: number;
  r: number;
  dm: string;
}

export const rapportAgencesData: RapportAgence[] = [
  { n: "Akpakpa",     a: 8, d: 687, c: 1247500, r: -184000, dm: "+14%" },
  { n: "Cotonou",     a: 4, d: 421, c:  682000, r:  -94000, dm: "+11%" },
  { n: "Sèmè-Kpodji", a: 3, d: 298, c:  524000, r:  -58000, dm: "+7%"  },
  { n: "Adjarra",     a: 3, d: 312, c:  587000, r:  -42000, dm: "+18%" },
  { n: "Ouando",      a: 2, d: 108, c:  198000, r:  -22000, dm: "−4%"  },
  { n: "Porto-Novo",  a: 1, d:  64, c:  112000, r:   -8000, dm: "+3%"  },
  { n: "Cadjehoun",   a: 1, d:  52, c:   97000, r:   -4000, dm: "+9%"  },
];

export interface RapportFile {
  ti: string;
  sz: string;
  dt: string;
}

export const rapportFilesData: RapportFile[] = [
  { ti: "Rapport mensuel mai 2026",  sz: "2,4 MB", dt: "21/05" },
  { ti: "Rapport hebdo sem. 20",     sz: "890 KB", dt: "19/05" },
  { ti: "Rapport journalier 20/05",  sz: "312 KB", dt: "20/05" },
  { ti: "Rapport mensuel avr. 2026", sz: "2,1 MB", dt: "01/05" },
  { ti: "Rapport T1 2026",           sz: "4,8 MB", dt: "01/04" },
];
