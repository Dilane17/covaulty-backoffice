"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { Stars } from "@/components/ui/Stars";
import { Pagination } from "@/components/ui/Pagination";
import { Topbar } from "@/components/layout/Topbar";
import { ClientFicheModal } from "@/components/modals/ClientFicheModal";
import { fcfa } from "@/utils/fcfa";
import { clientsData } from "@/data/clients";
import { Client } from "@/types/client";

export function ClientsScreen() {
  const [open, setOpen] = useState<Client | null>(null);

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Clients"]}
        title="Clients"
        sub="12 480 clients · +184 cette semaine"
        actions={<button className="btn btn-primary btn-sm"><Ic.Plus /> Nouveau client KYC</button>}
      />

      <div className="filter-bar">
        <div className="searchbar"><span className="ic"><Ic.Search /></span><input placeholder="Nom, compte, CNI…" /></div>
        <DropChip label="Toutes les agences" />
        <DropChip label="Score crédit" />
        <DropChip label="Statut KYC" />
        <div className="spacer" />
        <span className="muted" style={{ fontSize: 13 }}>12 480 clients trouvés</span>
      </div>

      <div className="content">
        <div className="card" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Client</th><th>Compte</th><th>Agent attribué</th>
                <th className="num">Solde</th><th>Score crédit</th><th>Statut KYC</th>
                <th>Dernière op.</th><th></th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((r, i) => (
                <tr key={i} onClick={() => setOpen(r)} style={{ cursor: "pointer" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="av">{r.i}</div>
                      <div>
                        <div className="fw-500">{r.n}</div>
                        <div className="muted" style={{ fontSize: 11 }}>{r.em}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>{r.ac}</td>
                  <td>{r.agt}</td>
                  <td className="num tnum fw-600">{fcfa(r.s)}</td>
                  <td><Stars value={r.sc} /></td>
                  <td>
                    {r.ky === "ok"   && <span className="pill good"><Ic.Check /> Validé</span>}
                    {r.ky === "warn" && <span className="pill warn"><span className="dot" /> En attente</span>}
                  </td>
                  <td className="muted">{r.lo}</td>
                  <td><button className="btn-icon" style={{ color: "var(--ink-3)" }}><Ic.Eye /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={12480} page={1} pageSize={15} />
        </div>
      </div>

      {open && <ClientFicheModal r={open} onClose={() => setOpen(null)} />}
    </>
  );
}
