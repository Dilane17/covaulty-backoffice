export type TransactionType = "dep" | "ret" | "adj" | "com";
export type TransactionStatus = "ok" | "sync" | "admin";

export interface Transaction {
  t: TransactionType;
  r: string;
  dt: string;
  a: string;
  c: string;
  ac: string;
  m: number;
  sa: number | null;
  st: TransactionStatus;
}
