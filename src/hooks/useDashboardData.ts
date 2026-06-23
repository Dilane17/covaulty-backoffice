import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { fcfa } from "@/utils/fcfa";
import { initials } from "@/utils/initials";
import { collectionService } from "@/services/collection.service";
import { clientService } from "@/services/client.service";
import { userService } from "@/services/user.service";
import { loanService } from "@/services/loan.service";
import { remittanceService } from "@/services/remittance.service";
import { alertService } from "@/services/alert.service";
import { analyticsService } from "@/services/analytics.service";
import { Alert } from "@/types/alert.types";

function getPast7Days() {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

function formatTime() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function useDashboardData() {
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [metrics, setMetrics] = useState({
    collecte: 0,
    nbCollectes: 0,
    remises: 0,
    prets: 0,
    nbPrets: 0,
    clients: 0,
    agents: 0,
  });

  const [liveStream, setLiveStream] = useState<Record<string, any>[]>([]);
  const [chartData, setChartData] = useState<{x: string, y: number, tip?: string}[]>([]);
  const [barData, setBarData] = useState<{x: string, y1: number, y2: number}[]>([]);
  const [zonesData, setZonesData] = useState<{l: string, v: number, c: string}[]>([]);
  const [topAgents, setTopAgents] = useState<Record<string, any>[]>([]);
  const [zoneActivity, setZoneActivity] = useState<Record<string, any>[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const lastTxIdRef = useRef<string | null>(null);

  const fetchLiveData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, rankRes, colRes, cliRes, usrRes, lonRes, remRes, altRes] = await Promise.all([
        analyticsService.getDashboard().catch(() => null),
        analyticsService.getRanking().catch(() => []),
        collectionService.getTransactions({ type: "DEPOSIT" }).catch(() => []),
        clientService.getAll().catch(() => []),
        userService.getAll().catch(() => []),
        loanService.getAll().catch(() => []),
        remittanceService.getAll().catch(() => []),
        alertService.getAlerts("OPEN").catch(() => [])
      ]);

      const collectes = Array.isArray(colRes) ? colRes : (colRes as { data?: Record<string, any>[] }).data || [];
      const clients = Array.isArray(cliRes) ? cliRes : (cliRes as { data?: Record<string, any>[] }).data || [];
      const users = Array.isArray(usrRes) ? usrRes : (usrRes as { data?: Record<string, any>[] }).data || [];
      const loans = Array.isArray(lonRes) ? lonRes : (lonRes as { data?: Record<string, any>[] }).data || [];
      const remittances = Array.isArray(remRes) ? remRes : (remRes as { data?: Record<string, any>[] }).data || [];
      const alertsData = Array.isArray(altRes) ? altRes : (altRes as { data?: Record<string, any>[] }).data || [];
      
      const dashboardStats = (dashRes as { data?: Record<string, any> })?.data || dashRes || {};
      const rankData = Array.isArray(rankRes) ? rankRes : (rankRes as { data?: Record<string, any>[] }).data || [];
      
      setAlerts(alertsData.slice(0, 5));
      
      if (collectes.length > 0) {
        lastTxIdRef.current = collectes[0].id;
      }

      let totalRemises = 0;
      remittances.forEach((r: Record<string, any>) => {
        if (r.status === "VALIDATED" && r.countedAmount) {
          totalRemises += r.countedAmount;
        } else if (r.status === "RESOLVED" && r.finalAmount) {
          totalRemises += r.finalAmount;
        }
      });

      let totalPrets = 0;
      loans.forEach((l: Record<string, any>) => {
        if (l.status === "DISBURSED" || l.status === "APPROVED") {
          totalPrets += l.principal || 0;
        }
      });

      setMetrics({
        collecte: dashboardStats.dailyCollection || 0,
        nbCollectes: dashboardStats.depositsCount || 0,
        remises: totalRemises,
        prets: totalPrets,
        nbPrets: loans.length,
        clients: clients.length,
        agents: users.filter((u: Record<string, any>) => u.role === "AGENT").length,
      });

      const stream = collectes.slice(0, 6).map((c: Record<string, any>) => {
        const p = c.receiptPayload || {};
        const amt = typeof c.amount === "number" ? c.amount : parseFloat(c.amount) || 0;
        return {
          id: c.id,
          i: initials(p.agentName || "Agent"),
          n: p.agentName || "Agent Inconnu",
          z: "Terrain",
          who: p.clientName || "Client",
          t: p.date ? new Date(p.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Maintenant",
          a: fcfa(amt),
          isAccent: true
        };
      });
      setLiveStream(stream);

      const last7Days = getPast7Days();
      const lData = last7Days.map(date => {
          let sum = 0;
          collectes.forEach((c: Record<string, any>) => {
              const d = (c.receiptPayload?.date || c.createdAt || "").split('T')[0];
              if (d === date) sum += (typeof c.amount === "number" ? c.amount : parseFloat(c.amount) || 0);
          });
          return { x: date.slice(5).replace('-', '/'), y: sum / 1000000, tip: sum >= 1000000 ? `${(sum / 1000000).toFixed(1)}M F` : `${(sum / 1000).toFixed(0)}k F` };
      });
      setChartData(lData);

      const bData = last7Days.map(date => {
          let dep = 0;
          let ret = 0;
          collectes.forEach((c: Record<string, any>) => {
              const d = (c.receiptPayload?.date || c.createdAt || "").split('T')[0];
              if (d === date) {
                  const amt = typeof c.amount === "number" ? c.amount : parseFloat(c.amount) || 0;
                  if (c.type === "DEPOSIT" || !c.type) dep += amt;
                  if (c.type === "WITHDRAWAL") ret += amt;
              }
          });
          return { x: date.slice(5).replace('-', '/'), y1: dep / 1000000, y2: ret / 1000000 };
      });
      setBarData(bData);

      const tAgents = rankData.slice(0, 5).map((a: Record<string, any>) => ({
          i: initials(a.agentName || "Agent"),
          n: a.agentName || "Agent",
          z: "Secteur Actif",
          d: Math.floor(Math.random() * 15) + 1,
          c: a.collected || 0,
          o: Math.min(100, Math.round(a.progress || 0)),
          st: "live"
      }));
      setTopAgents(tAgents);

      const colors = ["#255C99", "#B3001B", "#F6A21E", "#34C759"];
      let zData: {l: string, v: number, c: string}[] = [];
      const totalCol = dashboardStats.dailyCollection || 0;
      
      if (totalCol === 0 || rankData.length === 0) {
          zData = [{ l: "Aucune donnée", v: 100, c: "#E2E8F0" }];
      } else {
          zData = rankData.slice(0, 4).map((a: Record<string, any>, i: number) => ({
              l: a.agentName,
              v: Math.round((a.collected / totalCol) * 100) || 0,
              c: colors[i % colors.length]
          }));
      }
      setZonesData(zData);

      const zaData = zData.filter(z => z.l !== "Aucune donnée").map(z => ({
          name: z.l,
          pct: z.v,
          collecte: fcfa((z.v / 100) * totalCol),
          agents: 1,
          totalAgents: 1,
          color: z.c
      }));
      setZoneActivity(zaData);

    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      toast.error("Erreur de rafraîchissement du dashboard.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResolveAlert = useCallback(async (id: string) => {
    try {
      await alertService.resolveAlert(id);
      toast.success("Alerte résolue avec succès");
      fetchLiveData();
    } catch (err) {
      toast.error("Erreur lors de la résolution de l'alerte.");
    }
  }, [fetchLiveData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLiveData();
    const clock = setInterval(() => setNow(formatTime()), 1000);
    const rotate = setInterval(() => setTick((x) => x + 1), 3500);

    const onFocus = () => {
      fetchLiveData();
    };
    window.addEventListener("focus", onFocus);

    const smartPing = async () => {
      try {
        const colRes = await collectionService.getTransactions({ type: "DEPOSIT" }).catch(() => []);
        const latestCollectes = Array.isArray(colRes) ? colRes : (colRes as { data?: Record<string, any>[] }).data || [];
        
        if (latestCollectes.length > 0) {
          const newLatestId = latestCollectes[0].id;
          if (lastTxIdRef.current && lastTxIdRef.current !== newLatestId) {
            fetchLiveData();
          }
        }
      } catch (err) {
      }
    };
    const pingInterval = setInterval(smartPing, 20000);

    return () => {
      clearInterval(clock);
      clearInterval(rotate);
      clearInterval(pingInterval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchLiveData]);

  const offset = liveStream.length > 0 ? tick % liveStream.length : 0;
  const visibleStream = liveStream.length > 0 ? [
    ...liveStream.slice(offset),
    ...liveStream.slice(0, offset),
  ] : [];

  return {
    data: {
      now,
      metrics,
      visibleStream,
      chartData,
      barData,
      zonesData,
      topAgents,
      zoneActivity,
      alerts,
    },
    loading,
    error,
    refetch: fetchLiveData,
    handleResolveAlert
  };
}
