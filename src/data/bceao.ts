export const bceaoTypes: string[] = [
  "Journal des collectes (toutes transactions horodatées)",
  "Récapitulatif par agent",
  "Récapitulatif par agence",
  "Soldes clients fin de période",
  "Mouvements de trésorerie",
  "Registre KYC (clients + statuts)",
  "Journal d'audit (actions système)",
  "Indicateurs LBC/FT (transactions > 500 000 F)",
];

export interface BceaoExport {
  d: string;
  p: string;
  t: string;
  ag: string;
  tx: string;
}

export const bceaoHistoryData: BceaoExport[] = [
  { d: "21/05/2026", p: "Mai 2026",     t: "Mensuel",     ag: "Toutes", tx: "1 847" },
  { d: "01/05/2026", p: "Avril 2026",   t: "Mensuel",     ag: "Toutes", tx: "2 134" },
  { d: "01/04/2026", p: "Mars 2026",    t: "Mensuel",     ag: "Toutes", tx: "1 987" },
  { d: "01/04/2026", p: "T1 2026",      t: "Trimestriel", ag: "Toutes", tx: "5 847" },
  { d: "01/03/2026", p: "Février 2026", t: "Mensuel",     ag: "Toutes", tx: "1 762" },
  { d: "01/02/2026", p: "Janvier 2026", t: "Mensuel",     ag: "Toutes", tx: "1 845" },
];
