"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Ic } from "@/components/ui/Icons";
import { Institution } from "@/types/institution.types";
import { institutionService } from "@/services/institution.service";
import { InviteInstitutionModal } from "@/components/modals/InviteInstitutionModal";
import { useTenantStore } from "@/store/tenant.store";

export function InstitutionsScreen() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const res: any = await institutionService.getAll();
      // Fallback au cas où l'API renvoie un objet { data: [...] } au lieu du tableau direct
      const items = Array.isArray(res) ? res : (res.data || []);
      setInstitutions(items);
    } catch (err) {
      console.error("Fetch institutions error:", err);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const list = Array.isArray(institutions) ? institutions : [];

  return (
    <>
      <Topbar
        crumb={["SaaS Admin", "Institutions"]}
        title="Microfinances Clientes"
        sub={`${list.length} institutions hébergées`}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowInviteModal(true)}>
            <Ic.Plus /> Inviter une institution
          </button>
        }
      />

      <div className="content">
        <div className="card p-0">
          {loading ? (
            <div className="p-8 text-center muted">Chargement des institutions...</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Institution</th>
                  <th>Sous-domaine</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 muted">Aucune institution cliente trouvée.</td></tr>
                )}
                {list.map(inst => (
                  <tr key={inst.id}>
                    <td className="mono muted text-xs">{inst.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="av text-white" style={{ background: inst.primaryColor || "var(--primary)" }}>
                          {inst.name ? inst.name[0] : "I"}
                        </div>
                        <div className="fw-500">{inst.name || "Nom inconnu"}</div>
                      </div>
                    </td>
                    <td><span className="pill">{inst.subdomain || "N/A"}.covaulty.com</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon muted" aria-label="Voir les détails de l'institution"><Ic.Eye /></button>
                        <button className="btn btn-primary btn-sm" onClick={() => {
                          useTenantStore.getState().setInstitutionFromUser(inst);
                          window.location.hash = "#dashboard";
                        }}>Administrer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showInviteModal && (
        <InviteInstitutionModal 
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            fetchInstitutions();
          }}
        />
      )}
    </>
  );
}
