"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { institutionService } from "@/services/institution.service";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function InviteInstitutionModal({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await institutionService.invite({ name, contactEmail: email });
      onSuccess();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Erreur lors de l'invitation de l'institution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-[450px]" onClick={e => e.stopPropagation()}>
        <div className="modal-head brand">
          <div className="title">Nouvelle Microfinance</div>
          <button className="btn-icon" aria-label="Fermer" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="modal-body">
          <p className="muted mb-6">Un email d'invitation sera envoyé à l'administrateur pour configurer son mot de passe et activer l'espace de son institution.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-start gap-2">
            <span className="mt-0.5"><Ic.Alert /></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field">
            <label htmlFor="inst-name">Nom de l'Institution</label>
            <div className="input">
              <input 
                id="inst-name"
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Ex: COOPEC Akpakpa" 
                disabled={loading} 
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="inst-email">Email de l'Administrateur (Contact principal)</label>
            <div className="input">
              <input 
                id="inst-email"
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="admin@coopec.bj" 
                disabled={loading} 
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Génération..." : "Envoyer l'invitation"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
