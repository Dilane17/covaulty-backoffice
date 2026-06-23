"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { CreateAgencyPayload } from "@/types/agency.types";

interface Props {
  onClose: () => void;
  onSave: (data: CreateAgencyPayload) => Promise<void>;
}

export function AgenceFormModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSave({ name, address });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Erreur lors de la création de l'agence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-[500px]" onClick={e => e.stopPropagation()}>
        <div className="modal-head brand">
          <div className="title">Nouvelle Agence</div>
          <button className="btn-icon" aria-label="Fermer" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="modal-body">
          <p className="muted mb-6">Ajoutez un nouveau point de présence pour votre institution.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-start gap-2">
            <span className="mt-0.5"><Ic.Alert /></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="agence-name">Nom de l'agence</label>
            <input id="agence-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Agence Principale Cotonou" disabled={loading} />
          </div>
          
          <div className="input-group">
            <label htmlFor="agence-address">Adresse complète</label>
            <input id="agence-address" required value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Quartier Haie Vive, Rue 12" disabled={loading} />
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Création..." : "Créer l'agence"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
