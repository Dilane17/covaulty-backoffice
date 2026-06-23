"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { User, CreateUserPayload } from "@/types/user.types";
import { Agency } from "@/types/agency.types";
import { agencyService } from "@/services/agency.service";

interface AgentFormModalProps {
  agent?: User;
  onClose: () => void;
  onSave: (data: CreateUserPayload) => Promise<any>;
}

export function AgentFormModal({ agent, onClose, onSave }: AgentFormModalProps) {
  const isEdit = !!agent;

  const [firstName, setFirstName] = useState(agent?.firstName ?? "");
  const [lastName, setLastName] = useState(agent?.lastName ?? "");
  const [email, setEmail] = useState(agent?.email ?? "");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [role, setRole] = useState(agent?.role ?? "AGENT");
  const [agencyId, setAgencyId] = useState(agent?.agencyId ?? "");

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ agentCode: string; password?: string } | null>(null);

  useEffect(() => {
    agencyService.getAll().then(res => {
      setAgencies(Array.isArray(res) ? res : ((res as any).data || []));
    }).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await onSave({ 
        firstName, 
        lastName, 
        email,
        password: password || undefined,
        adminPassword: adminPassword,
        role, 
        agencyId: agencyId || undefined 
      });
      
      if (!isEdit && res && (res.user?.agentCode || res.agentCode)) {
        setSuccessData({
          agentCode: res.user?.agentCode || res.agentCode,
          password: res.generatedPassword || res.password || password || "******"
        });
      } else {
        onClose();
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  }

  if (successData) {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ maxWidth: 400 }}>
          <div className="modal-head brand">
            <div className="av lg" style={{ background: "var(--primary)", color: "#fff" }}><Ic.Check /></div>
            <div>
              <div className="title">Agent créé avec succès</div>
            </div>
          </div>
          <div className="modal-body text-center">
            <div style={{ background: "var(--primary-100)", border: "1px solid var(--primary-200)", padding: 24, borderRadius: 12, marginBottom: 16 }}>
              <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 8 }}>Code Agent</div>
              <div className="tnum fw-600" style={{ fontSize: 28, color: "var(--ink)", marginBottom: 16 }}>{successData.agentCode}</div>
              <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 8 }}>Mot de passe</div>
              <div className="tnum fw-600" style={{ fontSize: 24, color: "var(--ink)" }}>{successData.password}</div>
            </div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 24 }}>
              <Ic.Alert /> Ces informations ne seront plus affichées. Transmettez-les à l'agent maintenant.
            </div>
            <button type="button" className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
              J'ai noté ces informations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(ev) => ev.stopPropagation()}>
        <div className="modal-head brand">
          <div className="av lg" style={{ background: "var(--primary)", color: "#fff" }}>
            {isEdit ? (firstName[0] || "U") : <Ic.Plus />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="title">
              {isEdit ? `Modifier ${firstName} ${lastName}` : "Ajouter un membre du Staff"}
            </div>
            <div className="sub">
              {isEdit ? "Mise à jour des informations" : "Nouveau collaborateur"}
            </div>
          </div>
          <button className="close" onClick={onClose} disabled={loading}><Ic.X /></button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 mx-6 mt-4 rounded-lg text-sm border border-red-100 flex items-start gap-2">
            <span className="mt-0.5"><Ic.Alert /></span>
            <span>{error}</span>
          </div>
        )}

        <form className="modal-body" onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="input-group">
                <label htmlFor="agent-firstname">Prénom</label>
                <input id="agent-firstname" required value={firstName} onChange={e => setFirstName(e.target.value)} disabled={loading} placeholder="Ex: Jean" />
              </div>
              <div className="input-group">
                <label htmlFor="agent-lastname">Nom</label>
                <input id="agent-lastname" required value={lastName} onChange={e => setLastName(e.target.value)} disabled={loading} placeholder="Ex: Dupont" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="agent-email">Email professionnel</label>
              <input id="agent-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading} placeholder="jean.dupont@covaulty.com" />
            </div>

            {!isEdit && (
              <div className="input-group">
                <label htmlFor="agent-password">Mot de passe initial (Optionnel)</label>
                <input id="agent-password" type="text" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} placeholder="Généré automatiquement si vide" />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="input-group">
                <label htmlFor="agent-role">Rôle</label>
                <select id="agent-role" value={role} onChange={e => setRole(e.target.value as "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "AGENT")} disabled={loading}>
                  <option value="AGENT">Agent terrain</option>
                  <option value="MANAGER">Manager d'agence</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="agent-agency">Agence affiliée</label>
                <select id="agent-agency" value={agencyId} onChange={e => setAgencyId(e.target.value)} disabled={loading}>
                  <option value="">Aucune agence</option>
                  {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="input-group" style={{ marginBottom: 24 }}>
            <label htmlFor="agent-admin-password">Votre mot de passe Admin</label>
            <input id="agent-admin-password" type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} disabled={loading} placeholder="Pour autoriser cette création" />
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Requis pour confirmer la création de l'agent.</div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? "Chargement..." : isEdit ? "Enregistrer" : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
