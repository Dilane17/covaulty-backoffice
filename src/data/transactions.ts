import { Transaction } from "@/types/transaction";

export const transactionsData: Transaction[] = [
  { t: "dep", r: "CV-0912",  dt: "21/05 09:12", a: "Koffi A.",    c: "M. Adjovi",      ac: "AKP-1284", m:  2000,  sa: 12500, st: "ok" },
  { t: "ret", r: "RET-0044", dt: "21/05 10:34", a: "Guichet",     c: "Mme Hounkpati",  ac: "AKP-0987", m: -15000, sa:  8200, st: "ok" },
  { t: "dep", r: "CV-0913",  dt: "21/05 09:14", a: "Adèle B.",    c: "M. Codjo",       ac: "COT-0234", m:  1500,  sa:  9800, st: "ok" },
  { t: "adj", r: "ADJ-0012", dt: "21/05 08:00", a: "Système",     c: "N/A",            ac: "AGC-001",  m:   500,  sa:  null, st: "admin" },
  { t: "dep", r: "CV-0914",  dt: "20/05 15:47", a: "Rachelle T.", c: "Mme Yovo",       ac: "ADJ-0567", m:  4000,  sa: 22000, st: "sync" },
  { t: "dep", r: "CV-0911",  dt: "20/05 14:22", a: "Sètondji P.", c: "M. Sètondji B.", ac: "SEM-1102", m:  1200,  sa:  5400, st: "ok" },
  { t: "com", r: "COM-0231", dt: "20/05 18:00", a: "Système",     c: "Koffi A.",       ac: "AGT-KA",   m:  2362,  sa:  null, st: "ok" },
  { t: "ret", r: "RET-0043", dt: "20/05 16:20", a: "Guichet",     c: "M. Bello R.",    ac: "COT-1980", m: -8500,  sa: 11200, st: "ok" },
  { t: "dep", r: "CV-0908",  dt: "20/05 13:11", a: "Koffi A.",    c: "M. Lokossou",    ac: "AKP-2104", m:  3000,  sa: 18700, st: "ok" },
  { t: "dep", r: "CV-0907",  dt: "20/05 12:50", a: "Adèle B.",    c: "Mme Akpo F.",    ac: "COT-0445", m:  5500,  sa: 31200, st: "ok" },
  { t: "adj", r: "ADJ-0011", dt: "20/05 09:30", a: "Admin",       c: "N/A",            ac: "AGC-002",  m: -1200,  sa:  null, st: "admin" },
  { t: "dep", r: "CV-0906",  dt: "20/05 11:30", a: "Rachelle T.", c: "M. Yebou D.",    ac: "ADJ-0901", m:  2200,  sa:  9100, st: "ok" },
  { t: "dep", r: "CV-0905",  dt: "20/05 10:14", a: "Sètondji P.", c: "Mme Akpo F.",    ac: "SEM-0334", m:  1800,  sa:  7700, st: "ok" },
  { t: "ret", r: "RET-0042", dt: "19/05 17:50", a: "Guichet",     c: "M. Houngbeji",   ac: "AKP-2891", m: -12000, sa:  4200, st: "ok" },
  { t: "dep", r: "CV-0904",  dt: "19/05 16:30", a: "Koffi A.",    c: "M. Adjovi",      ac: "AKP-1284", m:  1500,  sa: 10500, st: "ok" },
];
