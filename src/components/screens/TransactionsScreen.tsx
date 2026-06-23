"use client";

import { useState, ReactNode } from "react";
import { Ic } from "@/components/ui/Icons";
import { Pagination } from "@/components/ui/Pagination";
import { Topbar } from "@/components/layout/Topbar";
import { CollecteDetailModal } from "@/components/modals/CollecteDetailModal";
import { fcfa } from "@/utils/fcfa";

import { UnifiedTransaction, useTransactions } from "@/hooks/useTransactions";

const TYPES: Record<
  UnifiedTransaction["type"],
  { ic: ReactNode; label: string; color: string }
> = {
  COLLECTE: { ic: <Ic.ArrowUp />, label: "Collecte", color: "#10B981" }, // Vert
  VERSEMENT: { ic: <Ic.ArrowDown />, label: "Versement", color: "#3B82F6" }, // Bleu
  EPARGNE: { ic: <Ic.Cog />, label: "Épargne", color: "#8B5CF6" }, // Violet
  CREDIT: { ic: <Ic.Spark />, label: "Crédit", color: "#F59E0B" }, // Orange
  RETRAIT: { ic: <Ic.ArrowDown />, label: "Retrait", color: "#EF4444" }, // Rouge
};

export function TransactionsScreen() {
  const [open, setOpen] = useState<UnifiedTransaction | null>(null);
  
  const {
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
  } = useTransactions();

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Transactions"]}
        title="Transactions"
        sub="Historique complet · Toutes les opérations"
        actions={
          <>
            <button className="btn btn-ghost btn-sm" onClick={fetchAll}>
              <Ic.Refresh /> Actualiser
            </button>
            <button className="btn btn-ghost btn-sm">
              <Ic.Download /> Exporter
            </button>
          </>
        }
      />

      <div
        className="filter-bar"
        style={{
          flexDirection: "column",
          alignItems: "stretch",
          gap: 14,
          padding: "16px 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="searchbar">
            <span className="ic">
              <Ic.Search />
            </span>
            <input
              placeholder="Référence, client, agent…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select 
               value={agentIdFilter} 
               onChange={(e) => {
                 setAgentIdFilter(e.target.value);
                 if (e.target.value && tab === "Tous") setTab("Collectes");
               }}
               style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "6px 12px", borderRadius: 8, fontSize: 13, height: 36, minWidth: 160, outline: "none" }}
            >
              <option value="">Tous les agents</option>
              {agentsList.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
            </select>
          </div>
          <div className="tabs">
            {["Tous", "Collectes", "Versements", "Épargne", "Crédits", "Retraits"].map(
              (t) => (
                <button
                  key={t}
                  className={`tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              )
            )}
          </div>
        </div>
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setAdvanced((v) => !v)}
          >
            <Ic.Filter /> Filtres avancés <Ic.Chevron />
          </button>
        </div>
        {advanced && (
          <div
            className="bg-[var(--paper-4)] border border-[var(--line)] rounded-[14px] p-4 grid grid-cols-6 gap-3 items-end"
          >
            <div className="field">
              <label htmlFor="trans-date-from">Date de</label>
              <div className="input">
                <input id="trans-date-from" type="date" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="trans-date-to">à</label>
              <div className="input">
                <input id="trans-date-to" type="date" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="trans-agent">Agent</label>
              <div className="input">
                <select id="trans-agent">
                  <option>Tous</option>
                </select>
                <Ic.Chevron />
              </div>
            </div>
            <div className="field">
              <label htmlFor="trans-zone">Zone</label>
              <div className="input">
                <select id="trans-zone">
                  <option>Toutes</option>
                </select>
                <Ic.Chevron />
              </div>
            </div>
            <div className="field">
              <label htmlFor="trans-min">Montant min</label>
              <div className="input">
                <input id="trans-min" type="number" placeholder="0" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="trans-max">Montant max</label>
              <div className="input">
                <input id="trans-max" type="number" placeholder="Illimité" />
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm">
                Appliquer les filtres
              </button>
              <button className="btn btn-ghost btn-sm">Réinitialiser</button>
            </div>
          </div>
        )}
      </div>

      <div className="band cols-4">
        <div className="mini">
          <div className="lbl">Total des flux entrants</div>
          <div className="val text-accent">{fcfa(totalDepots)}</div>
        </div>
        <div className="mini">
          <div className="lbl">Total retraits</div>
          <div className="val" style={{ color: "#EF4444" }}>{fcfa(totalRetraits)}</div>
        </div>
        <div className="mini">
          <div className="lbl">Net</div>
          <div className="val">{fcfa(totalDepots - totalRetraits)}</div>
        </div>
        <div className="mini">
          <div className="lbl">Nb transactions</div>
          <div className="val">{filtered.length}</div>
        </div>
      </div>

      <div className="content">
        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div className="p-8 text-center muted">Chargement des transactions...</div>
          ) : (
            <>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Réf</th>
                    <th>Date · heure</th>
                    <th>Agent</th>
                    <th>Client</th>
                    <th className="num">Montant</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 muted">
                        Aucune transaction trouvée.
                      </td>
                    </tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.id + r.type} onClick={() => setOpen(r)} style={{ cursor: "pointer" }}>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            color: TYPES[r.type].color,
                            fontWeight: 500,
                          }}
                        >
                          {TYPES[r.type].ic} {TYPES[r.type].label}
                        </span>
                      </td>
                      <td className="mono">#{r.ref}</td>
                      <td className="muted tnum">
                        {new Date(r.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>{r.agentName}</td>
                      <td>{r.clientName}</td>
                      <td
                        className="num tnum fw-600"
                        style={{
                          color:
                            r.type === "RETRAIT" ? "#EF4444" : "var(--accent)",
                        }}
                      >
                        {fcfa(r.amount, { sign: r.type === "RETRAIT" })}
                      </td>
                      <td>
                        {r.status === "ok" && (
                          <span className="pill good">
                            <span className="dot" /> Confirmé
                          </span>
                        )}
                        {r.status === "sync" && (
                          <span className="pill warn">
                            <span className="dot" /> En attente
                          </span>
                        )}
                        {r.status === "admin" && (
                          <span className="pill">
                            <span className="dot" /> Validé admin
                          </span>
                        )}
                        {!["ok", "sync", "admin"].includes(r.status || "") && (
                          <span className="pill">
                            <span className="dot" /> {r.status}
                          </span>
                        )}
                        {r.hasSignature && (
                          <span className="pill ml-2" style={{ background: "var(--primary-10)", color: "var(--primary)", marginTop: 4 }}>
                            <Ic.Check /> Signé
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-icon"
                          aria-label="Voir les détails de la transaction"
                          style={{ color: "var(--ink-3)" }}
                          onClick={(e) => { e.stopPropagation(); setOpen(r); }}
                        >
                          <Ic.Eye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination total={filtered.length} page={1} pageSize={25} />
            </>
          )}
        </div>
      </div>

      {open && open.source === "collection" && (
        <CollecteDetailModal row={open.raw} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
