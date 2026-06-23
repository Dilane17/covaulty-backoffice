import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { collectionService } from "@/services/collection.service";
import { remittanceService } from "@/services/remittance.service";
import { savingsService } from "@/services/savings.service";
import { loanService } from "@/services/loan.service";
import { userService } from "@/services/user.service";

export interface UnifiedTransaction {
  id: string;
  type: "COLLECTE" | "VERSEMENT" | "EPARGNE" | "CREDIT" | "RETRAIT";
  amount: number;
  date: string;
  clientName?: string;
  agentName?: string;
  status?: string;
  source: "collection" | "remittance" | "savings" | "loan";
  ref?: string;
  hasSignature?: boolean;
  raw?: Record<string, unknown>;
}

export function useTransactions() {
  const [advanced, setAdvanced] = useState(false);
  const [tab, setTab] = useState("Tous");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentsList, setAgentsList] = useState<{id:string, firstName:string, lastName:string}[]>([]);
  const [agentIdFilter, setAgentIdFilter] = useState(() => {
    const hashParams = new URLSearchParams(typeof window !== "undefined" ? window.location.hash.split("?")[1] : "");
    return hashParams.get("agentId") || "";
  });

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [colRes, remRes, savRes, lonRes, usersRes] = await Promise.all([
        collectionService.getTransactions(agentIdFilter ? { agentId: agentIdFilter } : undefined).catch(() => []),
        remittanceService.getAll().catch(() => []),
        savingsService.getAccounts().catch(() => []),
        loanService.getAll().catch(() => []),
        userService.getAll({ role: "AGENT" }).catch(() => []),
      ]);

      setAgentsList(Array.isArray(usersRes) ? usersRes : ((usersRes as { data?: { id: string, firstName: string, lastName: string }[] }).data || []));

      const cols: UnifiedTransaction[] = (Array.isArray(colRes) ? colRes : []).map((t: Record<string, any>) => ({
        id: t.id,
        type: t.type === "WITHDRAWAL" ? "RETRAIT" : "COLLECTE",
        amount: Number(t.amount) || 0,
        date: t.receiptPayload?.date || t.createdAt || new Date().toISOString(),
        clientName: t.receiptPayload?.clientName || "Client inconnu",
        agentName: t.receiptPayload?.agentName || "Agent inconnu",
        status: "ok",
        source: "collection",
        ref: t.receiptPayload?.localRef || t.id.substring(0, 8),
        hasSignature: !!t.receiptPayload?.signature,
        raw: t,
      }));

      const rems: UnifiedTransaction[] = (Array.isArray(remRes) ? remRes : []).map((r: Record<string, any>) => ({
        id: r.id,
        type: "VERSEMENT",
        amount: Number(r.declaredAmount) || 0,
        date: r.createdAt || new Date().toISOString(),
        agentName: r.agent ? `${r.agent.firstName} ${r.agent.lastName}` : "Agent inconnu",
        clientName: "—",
        status: r.status === "VALIDATED" ? "ok" : r.status === "PENDING" ? "sync" : "admin",
        source: "remittance",
        ref: r.id.substring(0, 8),
      }));

      const savs: UnifiedTransaction[] = (Array.isArray(savRes) ? savRes : []).map((s: Record<string, any>) => ({
        id: s.id,
        type: "EPARGNE",
        amount: Number(s.balance) || 0,
        date: s.createdAt || new Date().toISOString(),
        clientName: s.clientId || "Client",
        agentName: "—",
        status: "ok",
        source: "savings",
        ref: s.id.substring(0, 8),
      }));

      const lons: UnifiedTransaction[] = (Array.isArray(lonRes) ? lonRes : []).map((l: Record<string, any>) => ({
        id: l.id,
        type: "CREDIT",
        amount: Number(l.principal) || 0,
        date: l.approvedAt || l.disbursedAt || l.createdAt || new Date().toISOString(),
        clientName: l.clientId || "Client",
        agentName: "—",
        status: l.status === "APPROVED" || l.status === "DISBURSED" ? "ok" : "sync",
        source: "loan",
        ref: l.id.substring(0, 8),
      }));

      const merged = [...cols, ...rems, ...savs, ...lons].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(merged);
    } catch (err) {
      setTransactions([]);
      toast.error("Erreur lors du chargement des transactions");
    } finally {
      setLoading(false);
    }
  }, [agentIdFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  const filtered = transactions.filter((t) => {
    if (tab !== "Tous") {
      if (tab === "Collectes" && t.type !== "COLLECTE") return false;
      if (tab === "Versements" && t.type !== "VERSEMENT") return false;
      if (tab === "Épargne" && t.type !== "EPARGNE") return false;
      if (tab === "Crédits" && t.type !== "CREDIT") return false;
      if (tab === "Retraits" && t.type !== "RETRAIT") return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (
        !t.clientName?.toLowerCase().includes(q) &&
        !t.agentName?.toLowerCase().includes(q) &&
        !t.ref?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const totalDepots = transactions.filter((t) => t.amount > 0 && t.type !== "RETRAIT").reduce((acc, curr) => acc + curr.amount, 0);
  const totalRetraits = transactions.filter((t) => t.type === "RETRAIT").reduce((acc, curr) => acc + curr.amount, 0);

  return {
    advanced,
    setAdvanced,
    tab,
    setTab,
    search,
    setSearch,
    filtered,
    loading,
    agentsList,
    agentIdFilter,
    setAgentIdFilter,
    totalDepots,
    totalRetraits,
    fetchAll,
  };
}
