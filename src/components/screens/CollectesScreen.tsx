"use client";

import { useState, useMemo } from "react";
import { Ic } from "@/components/ui/Icons";
import { Pagination } from "@/components/ui/Pagination";
import { Topbar } from "@/components/layout/Topbar";
import { CollecteDetailModal } from "@/components/modals/CollecteDetailModal";
import { fcfa } from "@/utils/fcfa";
import { collectesData } from "@/data/collectes";
import { CollecteRow } from "@/types/collecte";

const PAGE_SIZE = 12;

export function CollectesScreen() {
  const [open, setOpen] = useState<CollecteRow | null>(null);
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<"all" | "ok" | "sync">("all");
  const [page, setPage] = useState(1);

  function reset() {
    setSearch("");
    setStatut("all");
    setPage(1);
  }

  const filtered = useMemo(() => {
    return collectesData.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        q === "" ||
        r.c.toLowerCase().includes(q) ||
        r.a.toLowerCase().includes(q) ||
        r.r.toLowerCase().includes(q) ||
        r.z.toLowerCase().includes(q);
      const matchStatut = statut === "all" || r.st === statut;
      return matchSearch && matchStatut;
    });
  }, [search, statut]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalCollecte = collectesData.reduce((s, r) => s + r.m, 0);
  const agentsActifs = new Set(collectesData.map((r) => r.ai)).size;
  const totalDepots = collectesData.length;

  const hasFilters = search !== "" || statut !== "all";

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Collectes du jour"]}
        title="Collectes du jour"
        sub={`21 mai 2026 · ${totalDepots} dépôts · ${fcfa(totalCollecte)} encaissés`}
        actions={
          <>
            <button className="btn btn-ghost btn-sm">
              <Ic.Download /> Exporter CSV
            </button>
            <button className="btn btn-ghost btn-sm">
              <Ic.Print /> Imprimer rapport
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
          <Ic.Calendar /> 21 mai 2026
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
          <table className="tbl">
            <thead>
              <tr>
                <th>Réf</th>
                <th>Heure</th>
                <th>Agent</th>
                <th>Client</th>
                <th>Zone</th>
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
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "32px 0",
                      color: "var(--ink-3)",
                    }}
                  >
                    Aucune collecte ne correspond aux filtres
                  </td>
                </tr>
              ) : (
                paginated.map((r, i) => (
                  <tr
                    key={i}
                    onClick={() => setOpen(r)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="mono">#{r.r}</td>
                    <td className="muted tnum">{r.h}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div className="av sm">{r.ai}</div>
                        {r.a}
                      </div>
                    </td>
                    <td>{r.c}</td>
                    <td className="muted">{r.z}</td>
                    <td className="num tnum fw-600 text-accent">
                      {fcfa(r.m, { sign: true })}
                    </td>
                    <td className="muted">{r.md}</td>
                    <td>
                      {r.st === "ok" ? (
                        <span className="pill good">
                          <span className="dot" /> Confirmé
                        </span>
                      ) : (
                        <span className="pill warn">
                          <span className="dot" /> En attente sync.
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-icon"
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
                ))
              )}
            </tbody>
          </table>
          <Pagination
            total={filtered.length}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </div>
      </div>

      {open && <CollecteDetailModal row={open} onClose={() => setOpen(null)} />}
    </>
  );
}
