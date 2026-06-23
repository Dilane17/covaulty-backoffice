"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Stat } from "@/components/ui/Stat";
import { InstMetric } from "@/components/ui/Field";
import { Logomark } from "@/components/ui/Logomark";
import { Topbar } from "@/components/layout/Topbar";
import { AgenceModal } from "@/components/modals/AgenceModal";
import { AgenceFormModal } from "@/components/modals/AgenceFormModal";
import { fcfa } from "@/utils/fcfa";
import { Agency, CreateAgencyPayload } from "@/types/agency.types";
import { agencyService } from "@/services/agency.service";
import { useTenantStore } from "@/store/tenant.store";

export function AgencesScreen() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [openViewer, setOpenViewer] = useState<Agency | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { institution } = useTenantStore();

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const res: any = await agencyService.getAll();
      const items = Array.isArray(res) ? res : (res.data || []);
      setAgencies(items);
    } catch (err) {
      console.error("Fetch agencies error:", err);
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleCreateAgency = async (payload: CreateAgencyPayload) => {
    await agencyService.create(payload);
    setShowForm(false);
    fetchAgencies();
  };

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Agences"]}
        title="Agences"
        sub={`${agencies.length} agences · ${institution?.name || "Institution"}`}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Ic.Plus /> Nouvelle agence</button>}
      />

      <div className="content">
        <div className="bg-carbon text-white rounded-[14px] py-5 px-6 grid grid-cols-[auto_1fr_repeat(4,auto)] gap-7 items-center mb-6">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logomark size={36} />
          </div>
          <div>
            <div className="h3" style={{ color: "#fff", fontSize: 18 }}>{institution?.name || "Institution"}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>Point de présence global</div>
          </div>
          <InstMetric v={agencies.length.toString()} l="Agences" />
          <InstMetric v="-" l="Agents" />
          <InstMetric v="-" l="Clients" />
          <InstMetric v="-" l="Trésorerie" />
        </div>

        {loading ? (
          <div className="p-8 text-center muted">Chargement des agences...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {agencies.length === 0 && (
              <div className="card text-center p-8 muted" style={{ gridColumn: "1 / -1" }}>Aucune agence trouvée.</div>
            )}
            {agencies.map((a) => (
              <div className="card" key={a.id} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, borderRadius: 22 }}>
                <div>
                  <span className="pill" style={{ background: "var(--primary-50)", color: "var(--primary)" }}>{a.name.split(" ")[0]}</span>
                  <div className="h3" style={{ marginTop: 8 }}>{a.name}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{a.address}</div>
                </div>

                <div className="between" style={{ padding: "10px 0", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line-2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="av sm" style={{ background: "var(--paper-2)", color: "var(--ink)" }}><Ic.Phone /></div>
                    <div>
                      <div className="fw-500" style={{ fontSize: 13 }}>{a.phone || "Aucun téléphone"}</div>
                      <span className="pill role" style={{ fontSize: 10, padding: "2px 8px", marginTop: 2 }}>{a.email || "Aucun email"}</span>
                    </div>
                  </div>
                  <span className="pill good"><span className="dot" /> Opérationnelle</span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <Stat v="-" l="Agents" />
                  <Stat v="-" l="Clients" />
                  <Stat v={fcfa(a.walletBalance || 0)} l="Solde" big />
                  <Stat v="-" l="Objectif" />
                </div>

                <div className="bar full thick"><span style={{ width: `0%` }} /></div>

                <div className="between">
                  <div style={{ display: "flex", marginLeft: 0 }}>
                    {/* Placeholder pour les avatars des agents */}
                    <div className="av sm" style={{ border: "2px solid #fff", background: "var(--paper-2)", color: "var(--ink-3)" }}><Ic.Users /></div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setOpenViewer(a)}>Voir le détail <Ic.Arrow /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {openViewer && <AgenceModal a={openViewer} onClose={() => setOpenViewer(null)} />}
      {showForm && <AgenceFormModal onClose={() => setShowForm(false)} onSave={handleCreateAgency} />}
    </>
  );
}
