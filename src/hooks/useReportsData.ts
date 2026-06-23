import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { collectionService } from "@/services/collection.service";
import { agencyService } from "@/services/agency.service";
import { loanService } from "@/services/loan.service";
import { walletService } from "@/services/wallet.service";
import { userService } from "@/services/user.service";
import { analyticsService } from "@/services/analytics.service";

export interface ReportFile {
  ti: string;
  sz: string;
  dt: string;
}

export function useReportsData() {
  const [period, setPeriod] = useState("Ce mois");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [volumeParMois, setVolumeParMois] = useState<{x: string, y1: number, y2: number}[]>([]);
  const [donutData, setDonutData] = useState<{l: string, v: number, c: string}[]>([]);
  const [agencesStats, setAgencesStats] = useState<Record<string, any>[]>([]);
  const [kpis, setKpis] = useState({
    collecte: 0,
    retraits: 0,
    net: 0,
    commissions: 0,
    soldeTresorerie: 0,
  });
  const [transactions, setTransactions] = useState<Record<string, any>[]>([]);

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
        setError(null);
        const [txnsRes, agRes, lnRes, usrRes] = await Promise.all([
          collectionService.getTransactions().catch(() => []),
          agencyService.getAll().catch(() => []),
          loanService.getAll().catch(() => []),
          userService.getAll().catch(() => []),
        ]);

        const txns = Array.isArray(txnsRes) ? txnsRes : (txnsRes as { data?: Record<string, any>[] }).data || [];
        const agencies = Array.isArray(agRes) ? agRes : (agRes as { data?: Record<string, any>[] }).data || [];
        const users = Array.isArray(usrRes) ? usrRes : (usrRes as { data?: Record<string, any>[] }).data || [];

        setTransactions(txns);

        const wallets = await Promise.all(
          agencies.map((a: Record<string, any>) => walletService.getAgencyWallet(a.id as string).catch(() => null))
        );

        // --- KPIs ---
        let totalDepots = 0;
        let totalRetraits = 0;
        txns.forEach((t: Record<string, any>) => {
          const amt = Number(t.amount) || 0;
          if (t.type === "WITHDRAWAL") totalRetraits += amt;
          else totalDepots += amt;
        });

        let totalTresorerie = 0;
        wallets.forEach((w: Record<string, any> | null) => {
          if (w) totalTresorerie += Number(w.balance) || 0;
        });

        setKpis({
          collecte: totalDepots,
          retraits: totalRetraits,
          net: totalDepots - totalRetraits,
          commissions: totalDepots * 0.05,
          soldeTresorerie: totalTresorerie,
        });

        // --- Volume par mois ---
        const volume = txns.reduce((acc: Record<string, { dep: number; ret: number }>, txn: Record<string, any>) => {
          const date = txn.receiptPayload?.date || txn.createdAt || new Date();
          const mois = new Date(date).toLocaleDateString("fr-FR", { month: "short" });
          if (!acc[mois]) acc[mois] = { dep: 0, ret: 0 };
          const amt = Number(txn.amount) || 0;
          if (txn.type === "WITHDRAWAL") acc[mois].ret += amt;
          else acc[mois].dep += amt;
          return acc;
        }, {});

        const barData = Object.entries(volume).map(([m, v]: [string, { dep: number; ret: number }]) => ({
          x: m.charAt(0).toUpperCase() + m.slice(1),
          y1: v.dep / 1000000,
          y2: v.ret / 1000000,
        }));
        setVolumeParMois(barData);

        // --- Donut Data ---
        const nbDepots = txns.filter((t: Record<string, any>) => t.type !== "WITHDRAWAL").length;
        const nbRetraits = txns.filter((t: Record<string, any>) => t.type === "WITHDRAWAL").length;
        const totalTxns = nbDepots + nbRetraits;

        if (totalTxns > 0) {
          setDonutData([
            { l: "Dépôts", v: Math.round((nbDepots / totalTxns) * 100), c: "var(--accent)" },
            { l: "Retraits", v: Math.round((nbRetraits / totalTxns) * 100), c: "var(--primary)" },
          ]);
        } else {
          setDonutData([]);
        }

        // --- Agences Stats ---
        const stats = agencies.map((ag: Record<string, any>) => {
          const agUsers = users.filter((u: Record<string, any>) => u.agencyId === ag.id);
          const agUserIds = agUsers.map((u: Record<string, any>) => u.id);
          const agUserNames = agUsers.map((u: Record<string, any>) => `${u.firstName} ${u.lastName}`);

          const agTxns = txns.filter((t: Record<string, any>) =>
            agUserIds.includes(t.agentId) ||
            agUserNames.includes(t.receiptPayload?.agentName)
          );

          const deps = agTxns.filter((t: Record<string, any>) => t.type !== "WITHDRAWAL");
          const rets = agTxns.filter((t: Record<string, any>) => t.type === "WITHDRAWAL");

          const c = deps.reduce((sum: number, t: Record<string, any>) => sum + (Number(t.amount) || 0), 0);
          const r = rets.reduce((sum: number, t: Record<string, any>) => sum + (Number(t.amount) || 0), 0);

          return {
            n: ag.name,
            a: agUsers.length,
            d: deps.length,
            c,
            r: -r,
            dm: "+0%",
          };
        });
        setAgencesStats(stats);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("Erreur de chargement des rapports");
        console.error(err);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReportsData();
  }, [fetchReportsData]);

  const handleExportCSV = useCallback(async () => {
    try {
      const blob = await analyticsService.exportTransactions(); 
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `rapport_financier_${Date.now()}.csv`);
      link.click();
      toast.success("Rapport exporté avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'export des transactions.");
    }
  }, []);

  const recentFiles: ReportFile[] = [
    {
      ti: `Rapport mensuel ${new Date().toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}`,
      sz: "1,2 MB",
      dt: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    },
  ];

  return {
    data: {
      volumeParMois,
      donutData,
      agencesStats,
      kpis,
      transactions,
      recentFiles,
    },
    period,
    setPeriod,
    loading,
    error,
    handleExportCSV,
  };
}
