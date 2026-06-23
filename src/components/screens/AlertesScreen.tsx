"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { CounterTile } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";
import { alertService } from "@/services/alert.service";
import { Alert } from "@/types/alert.types";

const TAB_MAPPING: Record<string, string | undefined> = {
  "Toutes": undefined,
  "Ouvertes": "OPEN",
  "En cours": "IN_PROGRESS",
  "Résolues": "RESOLVED"
};

export function AlertesScreen() {
  const [tab, setTab] = useState("Toutes");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Pour les compteurs (facultatif si l'API ne donne pas les totaux on peut les approximer ou juste enlever le hardcode)
  // On va simplement faire une agrégation si on est sur "Toutes", sinon on laisse les compteurs bruts.
  const [openCount, setOpenCount] = useState(0);

  const fetchAlerts = async (statusFilter?: string) => {
    try {
      setLoading(true);
      const res = await alertService.getAlerts(statusFilter);
      const list: Alert[] = Array.isArray(res) ? res : ((res as unknown as {data: Alert[]}).data || []);
      setAlerts(list);

      // Si on charge tout, on met à jour le openCount pour les compteurs
      if (!statusFilter) {
        setOpenCount(list.filter(a => a.status === "OPEN").length);
      }
    } catch (err) {
      console.error(err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(TAB_MAPPING[tab]);
  }, [tab]);

  const handleResolve = async (id: string) => {
    try {
      await alertService.resolveAlert(id);
      fetchAlerts(TAB_MAPPING[tab]); // Refresh after resolve
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { code?: string, message?: string } } };
      if (axiosErr.response?.data?.code === "ALERT_001") {
        window.alert("Alerte introuvable.");
      } else {
        window.alert(axiosErr.response?.data?.message || "Erreur lors de la résolution de l'alerte.");
      }
    }
  };

  const getAlertClasses = (a: Alert) => {
    if (a.status === "RESOLVED") {
      return { card: "alert-card ok", tag: "alert-tag ok", kind: "alert-tag kind-ok", dot: "bg-[var(--accent)]" };
    }
    if (a.severity === "CRITICAL") {
      return { card: "alert-card crit", tag: "alert-tag crit", kind: "alert-tag kind", dot: "bg-[var(--primary)]" };
    }
    return { card: "alert-card warn", tag: "alert-tag warn", kind: "alert-tag kind-warn", dot: "bg-[var(--warn)]" };
  };

  const getTimeLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.floor((new Date().getTime() - d.getTime()) / 60000); // minutes
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)} h`;
    return `Il y a ${Math.floor(diff / 1440)} j`;
  };

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Alertes"]}
        title="Alertes"
        badge={openCount > 0 ? <span className="pill bad ml-3">{openCount} ouvertes</span> : undefined}
        actions={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => fetchAlerts(TAB_MAPPING[tab])}><Ic.Refresh /> Actualiser</button>
            <button className="btn btn-ghost btn-sm"><Ic.Cog /> Règles d'alerte</button>
          </>
        }
      />

      {/* Stats row - on garde les tuiles existantes mais on met le vrai openCount */}
      <div className="bg-white border-b border-[var(--line)] p-5 px-7 grid grid-cols-4 gap-4">
        <CounterTile color="var(--primary)" big={openCount.toString()}  small="Ouvertes"       icon={<Ic.Alert />} />
        <CounterTile color="var(--warn)"    big="-"  small="En cours"       icon={<Ic.Refresh />} />
        <CounterTile color="var(--accent)"  big="-" small="Résolues (30j)" icon={<Ic.Check />} />
        <CounterTile color="var(--ink-3)"   big="5"  small="Règles actives" icon={<Ic.Cog />} />
      </div>

      <div className="filter-bar bg-[var(--paper)] border-b-0 py-3 px-7">
        <div className="tabs">
          {Object.keys(TAB_MAPPING).map((t) => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t}
              {t === "Ouvertes" && openCount > 0 && (
                <span className="ml-1.5 bg-[var(--primary)] text-white px-1.5 py-px rounded-full text-[10px]">{openCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <DropChip label="Tous types" />
        <DropChip label="Tous agents" />
      </div>

      <div className="content flex flex-col gap-3">
        {loading ? (
          <div className="p-8 text-center muted">Chargement des alertes...</div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-[var(--good)] bg-[var(--paper)] rounded-xl flex items-center justify-center gap-2 border border-[var(--line)]">
            <Ic.Check /> Aucune alerte pour ce filtre.
          </div>
        ) : (
          alerts.map(a => {
            const { card, tag, kind, dot } = getAlertClasses(a);
            
            return (
              <div key={a.id} className={card}>
                <div className="alert-tagrow">
                  <span className={tag}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {a.status === "RESOLVED" ? "RÉSOLUE" : a.severity === "CRITICAL" ? "CRITIQUE" : "ATTENTION"}
                  </span>
                  <span className={kind}>{a.type || "Alerte"}</span>
                  <span className="muted ml-auto text-xs">{getTimeLabel(a.createdAt)}</span>
                </div>
                
                <h3>{a.message}</h3>
                <div className="det text-xs mt-1 text-[var(--ink-2)]">
                  ID de référence : <strong className="font-mono">{a.id}</strong>
                </div>
                
                <div className="alert-actions mt-4 flex gap-2">
                  {a.status !== "RESOLVED" && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => handleResolve(a.id)}>
                        <Ic.Check /> Marquer résolu
                      </button>
                      <button className="btn btn-ghost btn-sm text-[var(--ink-3)]">Ignorer</button>
                    </>
                  )}
                  {a.status === "RESOLVED" && (
                    <button className="btn btn-ghost btn-sm text-[var(--ink-3)]">Voir les détails</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
