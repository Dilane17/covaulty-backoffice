"use client";

import { useState, useMemo, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Pagination } from "@/components/ui/Pagination";
import { Topbar } from "@/components/layout/Topbar";
import { CollecteDetailModal } from "@/components/modals/CollecteDetailModal";
import { fcfa } from "@/utils/fcfa";
import { initials } from "@/utils/initials";
import { CollectionTransaction } from "@/types/collection.types";
import { collectionService } from "@/services/collection.service";

const PAGE_SIZE = 12;

export function CollectesScreen() {
  const [open, setOpen] = useState<CollectionTransaction | null>(null);
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<"all" | "ok" | "sync">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<CollectionTransaction[]>([]);

  const fetchCollectes = async () => {
    try {
      setLoading(true);
      // Récupère uniquement les dépôts par défaut
      const res: any = await collectionService.getTransactions({ type: "DEPOSIT" });
      setTransactions(Array.isArray(res) ? res : (res.data || []));
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectes();
  }, []);

  function reset() {
    setSearch("");
    setStatut("all");
    setPage(1);
  }

  const list = Array.isArray(transactions) ? transactions : [];

  const filtered = useMemo(() => {
    return list.filter((r) => {
      const q = search.toLowerCase();
      const p = r.receiptPayload || {};
      const agentName = (p.agentName || "").toLowerCase();
      const clientName = (p.clientName || "").toLowerCase();
      const localRef = (p.localRef || r.id).toLowerCase();
      
      const matchSearch =
        q === "" ||
        agentName.includes(q) ||
        clientName.includes(q) ||
        localRef.includes(q);
        
      // Tout ce qui vient de l'API centrale est considéré "ok" (synchronisé)
      const isOk = true;
      const matchStatut = statut === "all" || (statut === "ok" && isOk) || (statut === "sync" && !isOk);
      return matchSearch && matchStatut;
    });
  }, [search, statut, list]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalCollecte = list.reduce((s, r) => s + (typeof r.amount === "number" ? r.amount : parseFloat(r.amount as string) || 0), 0);
  const agentsActifs = new Set(list.map((r) => r.receiptPayload?.agentName || "Inconnu")).size;
  const totalDepots = list.length;

  const hasFilters = search !== "" || statut !== "all";

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Collectes du jour"]}
        title="Collectes du jour"
        sub={`${new Date().toLocaleDateString("fr-FR")} · ${totalDepots} dépôts · ${fcfa(totalCollecte)} encaissés`}
        actions={
          <>
            <button className="btn btn-ghost btn-sm" onClick={fetchCollectes}>
              <Ic.Refresh /> Actualiser
            </button>
            <button className="btn btn-ghost btn-sm">
              <Ic.Download /> Exporter CSV
            </button>
          </>
        }
      />

      <div className="filter-bar">
        <div className="searchbar">
          <span className="ic">
            <Ic.Search />
          </span>
          <input
            placeholder="Nom client, agent, référence…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div
          style={{
            display: "inline-flex",
            gap: 4,
            padding: 3,
            borderRadius: 999,
            background: "var(--paper-3)",
          }}
        >
          {(["all", "ok", "sync"] as const).map((s) => (
            <button
              key={s}
              className="tab"
              onClick={() => {
                setStatut(s);
                setPage(1);
              }}
              style={{
                background: statut === s ? "#fff" : "transparent",
                color: statut === s ? "var(--ink)" : "var(--ink-3)",
                boxShadow: statut === s ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {s === "all"
                ? "Tous"
                : s === "ok"
                  ? "Confirmés"
                  : "En attente sync."}
            </button>
          ))}
        </div>
        <button className="chip">
          <Ic.Calendar /> Aujourd'hui
        </button>
        <div className="spacer" />
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            <Ic.X /> Réinitialiser
          </button>
        )}
      </div>

      <div className="band">
        <div className="mini">
          <div className="lbl">Dépôts</div>
          <div className="val tnum">{totalDepots}</div>
        </div>
        <div className="mini">
          <div className="lbl">Collecté</div>
          <div className="val tnum">{fcfa(totalCollecte)}</div>
        </div>
        <div className="mini">
          <div className="lbl">Agents actifs</div>
          <div className="val tnum">{agentsActifs}</div>
        </div>
        {hasFilters && (
          <div className="mini">
            <div className="lbl">Résultats filtrés</div>
            <div className="val tnum">{filtered.length}</div>
          </div>
        )}
      </div>

      <div className="content">
        <div className="card" style={{ padding: 0 }}>
          {loading ? (
             <div className="p-8 text-center muted">Chargement de l'historique de collecte...</div>
          ) : (
          <>
          <table className="tbl">
            <thead>
              <tr>
                <th>Réf Locale</th>
                <th>Heure</th>
                <th>Agent</th>
                <th>Client</th>
                <th className="num">Montant</th>
                <th>Mode</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "32px 0",
                      color: "var(--ink-3)",
                    }}
                  >
                    Aucune collecte trouvée
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const p = r.receiptPayload || {};
                  const localRef = p.localRef || r.id.substring(0,8);
                  const agentName = p.agentName || "Inconnu";
                  const clientName = p.clientName || "Inconnu";
                  const dateStr = p.date ? new Date(p.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--:--";
                  const amountNum = typeof r.amount === "number" ? r.amount : parseFloat(r.amount as string) || 0;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setOpen(r)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="mono">#{localRef}</td>
                      <td className="muted tnum">{dateStr}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div className="av sm">{initials(agentName)}</div>
                          {agentName}
                        </div>
                      </td>
                      <td>{clientName}</td>
                      <td className="num tnum fw-600 text-accent">
                        {fcfa(amountNum, { sign: true })}
                      </td>
                      <td className="muted">ESPECE</td>
                      <td>
                        <span className="pill good">
                          <span className="dot" /> Confirmé
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-icon"
                          aria-label="Voir les détails de la collecte"
                          title="Voir le détail"
                          style={{ color: "var(--ink-3)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpen(r);
                          }}
                        >
                          <Ic.Eye />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <Pagination
            total={filtered.length}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
          </>
          )}
        </div>
      </div>

      {open && <CollecteDetailModal row={open} onClose={() => setOpen(null)} />}
    </>
  );
}
