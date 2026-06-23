"use client";

import { useEffect, useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { KpiSm } from "@/components/ui/KpiCard";
import { fcfa } from "@/utils/fcfa";
import { Agency } from "@/types/agency.types";
import { userService } from "@/services/user.service";
import { clientService } from "@/services/client.service";
import { User } from "@/types/user.types";

interface AgenceModalProps {
  a: Agency;
  onClose: () => void;
}

export function AgenceModal({ a, onClose }: AgenceModalProps) {
  const [agents, setAgents] = useState<User[]>([]);
  const [clientsCount, setClientsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Appel simultané des services pour récupérer les agents et les clients de cette agence
        const [agentsRes, clientsRes] = await Promise.all([
          userService.getAll({ role: "AGENT", agencyId: a.id }),
          clientService.getAll({ agencyId: a.id })
        ]);
        
        if (mounted) {
          // Gestion sécurisée de la structure de réponse
          setAgents(Array.isArray(agentsRes) ? agentsRes : (agentsRes as any).data || []);
          const clientsArray = Array.isArray(clientsRes) ? clientsRes : (clientsRes as any).data || [];
          setClientsCount(clientsArray.length);
        }
      } catch (err) {
        console.error("Failed to fetch agency stats", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchStats();
    return () => { mounted = false; };
  }, [a.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head brand-red">
          <div style={{ flex: 1 }}>
            <div className="title">{a.name}</div>
            <div className="sub">{a.address}</div>
          </div>
          <span className="pill good"><span className="dot" /> Opérationnelle</span>
          <button className="close" onClick={onClose}><Ic.X /></button>
        </div>
        
        <div className="tabs-underline" style={{ padding: "0 28px" }}>
          <button className="tab active">Vue générale</button>
        </div>
        
        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            <KpiSm v={loading ? "..." : agents.length} l="Agents rattachés" />
            <KpiSm v={loading ? "..." : clientsCount} l="Clients enregistrés" />
            <KpiSm v={fcfa(a.walletBalance || 0)} l="Solde global" />
          </div>

          <div className="divider" />

          <div className="eyebrow" style={{ marginBottom: 10 }}>Liste des Agents</div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Code Agent</th>
                <th>Nom Complet</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="text-center p-4 muted">Chargement des agents...</td>
                </tr>
              )}
              {!loading && agents.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-4 muted">Aucun agent rattaché à cette agence.</td>
                </tr>
              )}
              {!loading && agents.map((ag) => (
                <tr key={ag.id}>
                  <td className="fw-500 tnum">{ag.agentCode || "-"}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="av sm">{ag.firstName.charAt(0)}{ag.lastName.charAt(0)}</div>
                      {ag.firstName} {ag.lastName}
                    </div>
                  </td>
                  <td>
                    {ag.isActive ? (
                      <span className="pill good">Actif</span>
                    ) : (
                      <span className="pill bad">Inactif</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
