"use client";

import { useState, ReactNode } from "react";
import { Ic } from "@/components/ui/Icons";
import { Pagination } from "@/components/ui/Pagination";
import { Topbar } from "@/components/layout/Topbar";
import { fcfa } from "@/utils/fcfa";
import { transactionsData } from "@/data/transactions";
import { TransactionType } from "@/types/transaction";

const TYPES: Record<
  TransactionType,
  { ic: ReactNode; label: string; color: string }
> = {
  dep: { ic: <Ic.ArrowUp />, label: "Dépôt", color: "var(--accent)" },
  ret: { ic: <Ic.ArrowDown />, label: "Retrait", color: "var(--primary)" },
  adj: { ic: <Ic.Cog />, label: "Ajustement", color: "var(--ink-3)" },
  com: { ic: <Ic.Spark />, label: "Commission", color: "var(--warn)" },
};

export function TransactionsScreen() {
  const [advanced, setAdvanced] = useState(false);
  const [tab, setTab] = useState("Tous");

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Transactions"]}
        title="Transactions"
        sub="Historique complet · Toutes les opérations"
        actions={
          <>
            <button className="btn btn-ghost btn-sm">
              <Ic.Download /> Exporter
            </button>
            <button className="btn btn-ghost btn-sm">
              <Ic.Settings /> Colonnes
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
            <input placeholder="Référence, client, agent…" />
          </div>
          <div className="tabs">
            {["Tous", "Dépôts", "Retraits", "Ajustements", "Commissions"].map(
              (t) => (
                <button
                  key={t}
                  className={`tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ),
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
            style={{
              background: "var(--paper-4)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: 16,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 12,
              alignItems: "end",
            }}
          >
            <div className="field">
              <label>Date de</label>
              <div className="input sm">
                <input type="date" defaultValue="2026-05-01" />
              </div>
            </div>
            <div className="field">
              <label>à</label>
              <div className="input sm">
                <input type="date" defaultValue="2026-05-21" />
              </div>
            </div>
            <div className="field">
              <label>Agent</label>
              <div className="input sm">
                <select>
                  <option>Tous</option>
                </select>
                <Ic.Chevron />
              </div>
            </div>
            <div className="field">
              <label>Zone</label>
              <div className="input sm">
                <select>
                  <option>Toutes</option>
                </select>
                <Ic.Chevron />
              </div>
            </div>
            <div className="field">
              <label>Montant min</label>
              <div className="input sm">
                <input placeholder="0 F" />
              </div>
            </div>
            <div className="field">
              <label>Montant max</label>
              <div className="input sm">
                <input placeholder="∞" />
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
          <div className="lbl">Total dépôts</div>
          <div className="val text-accent">2 847 500 F</div>
        </div>
        <div className="mini">
          <div className="lbl">Total retraits</div>
          <div className="val text-primary">−412 000 F</div>
        </div>
        <div className="mini">
          <div className="lbl">Net</div>
          <div className="val">2 435 500 F</div>
        </div>
        <div className="mini">
          <div className="lbl">Nb transactions</div>
          <div className="val">1 847</div>
        </div>
      </div>

      <div className="content">
        <div className="card" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Type</th>
                <th>Réf</th>
                <th>Date · heure</th>
                <th>Agent</th>
                <th>Client</th>
                <th>Compte</th>
                <th className="num">Montant</th>
                <th className="num">Solde après</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: TYPES[r.t].color,
                        fontWeight: 500,
                      }}
                    >
                      {TYPES[r.t].ic} {TYPES[r.t].label}
                    </span>
                  </td>
                  <td className="mono">#{r.r}</td>
                  <td className="muted tnum">{r.dt}</td>
                  <td>{r.a}</td>
                  <td>{r.c}</td>
                  <td className="mono muted">{r.ac}</td>
                  <td
                    className="num tnum fw-600"
                    style={{
                      color:
                        r.m > 0
                          ? "var(--accent)"
                          : r.m < 0
                            ? "var(--primary)"
                            : "var(--ink-2)",
                    }}
                  >
                    {fcfa(r.m, { sign: true })}
                  </td>
                  <td className="num tnum">
                    {r.sa != null ? fcfa(r.sa) : "—"}
                  </td>
                  <td>
                    {r.st === "ok" && (
                      <span className="pill good">
                        <span className="dot" /> Confirmé
                      </span>
                    )}
                    {r.st === "sync" && (
                      <span className="pill warn">
                        <span className="dot" /> Hors-ligne
                      </span>
                    )}
                    {r.st === "admin" && (
                      <span className="pill">
                        <span className="dot" /> Validé admin
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      style={{ color: "var(--ink-3)" }}
                    >
                      <Ic.Eye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={1847} page={1} pageSize={15} />
        </div>
      </div>
    </>
  );
}
