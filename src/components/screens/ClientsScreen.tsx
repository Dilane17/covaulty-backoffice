"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { Stars } from "@/components/ui/Stars";
import { Pagination } from "@/components/ui/Pagination";
import { Topbar } from "@/components/layout/Topbar";
import { ClientFicheModal } from "@/components/modals/ClientFicheModal";
import { ClientFormModal } from "@/components/modals/ClientFormModal";
import { fcfa } from "@/utils/fcfa";
import { Client, CreateClientPayload } from "@/types/client.types";
import { clientService } from "@/services/client.service";

export function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Note (Audit) : L'endpoint `GET /clients` n'est pas explicitement documenté 
  // dans `docs/client/endpoints.md` (seul GET /clients/:id l'est). 
  // S'il n'est pas supporté côté backend, cette liste sera vide.
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res: any = await clientService.getAll();
      setClients(Array.isArray(res) ? res : (res.data || []));
    } catch (err) {
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const list = Array.isArray(clients) ? clients : [];

  const handleCreateClient = async (payload: CreateClientPayload) => {
    const res = await clientService.create(payload);
    fetchClients();
    return res;
  };

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Clients"]}
        title="Clients KYC"
        sub={`${list.length} clients trouvés`}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Ic.Plus /> Nouveau client KYC</button>}
      />

      <div className="filter-bar">
        <div className="searchbar"><span className="ic"><Ic.Search /></span><input placeholder="Nom, compte, CNI…" /></div>
        <DropChip label="Toutes les agences" />
        <DropChip label="Score crédit" />
        <DropChip label="Statut KYC" />
        <div className="spacer" />
        <span className="muted" style={{ fontSize: 13 }}>{list.length} clients trouvés</span>
      </div>

      <div className="content">
        <div className="card" style={{ padding: 0 }}>
          {loading ? (
             <div className="p-8 text-center muted">Chargement des clients...</div>
          ) : (
            <>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Client</th><th>Compte</th>
                    <th className="num">Solde Épargne</th><th>Score crédit</th><th>CNI</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 muted">Aucun client trouvé.</td></tr>
                  )}
                  {list.map((r) => (
                    <tr key={r.id} onClick={() => setOpen(r)} style={{ cursor: "pointer" }}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="av">{(r.firstName[0] || "U")}{(r.lastName?.[0] || "")}</div>
                          <div>
                            <div className="fw-500">{r.firstName} {r.lastName}</div>
                            <div className="muted" style={{ fontSize: 11 }}>{r.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="mono" style={{ fontSize: 11 }}>{r.clientCode || r.id.substring(0,8)}</td>
                      <td className="num tnum fw-600">
                        {fcfa(r.savingsAccounts?.[0]?.balance || 0)}
                      </td>
                      <td><Stars value={r.creditScore || 5} /></td>
                      <td className="mono muted" style={{ fontSize: 11 }}>
                        {r.idCardNumber || "Non défini"}
                      </td>
                      <td><button className="btn-icon" style={{ color: "var(--ink-3)" }} aria-label="Voir le client" onClick={() => setOpen(r)}><Ic.Eye /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination total={list.length} page={1} pageSize={15} />
            </>
          )}
        </div>
      </div>

      {open && <ClientFicheModal r={open} onClose={() => setOpen(null)} />}
      {showForm && (
        <ClientFormModal
          onClose={() => setShowForm(false)}
          onSave={handleCreateClient}
        />
      )}
    </>
  );
}
