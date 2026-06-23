"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { CreateClientPayload } from "@/types/client.types";

interface Props {
  onClose: () => void;
  onSave: (data: CreateClientPayload) => Promise<any>;
}

export function ClientFormModal({ onClose, onSave }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+229");
  const [address, setAddress] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await onSave({ firstName, lastName, phone, address, idCardNumber });
      if (res && res.clientCode) {
        setSuccessCode(res.clientCode);
      } else {
        onClose();
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { code?: string; message?: string } } };
      const code = axiosErr.response?.data?.code;
      
      if (code === "VALID_001") {
        setError("Le numéro de téléphone est invalide.");
      } else if (code === "SYS_001") {
        setError("Erreur lors de la génération du code client. Réessayez.");
      } else {
        setError(axiosErr.response?.data?.message || "Erreur lors de la création du client.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (successCode) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal max-w-[400px]" onClick={e => e.stopPropagation()}>
          <div className="modal-head brand">
            <div className="av lg bg-primary text-white"><Ic.Check /></div>
            <div>
              <div className="title">Client KYC créé avec succès</div>
            </div>
          </div>
          <div className="modal-body text-center">
            <div className="bg-[var(--primary-100)] border border-[var(--primary-200)] p-6 rounded-xl mb-4">
              <div className="eyebrow text-primary mb-2">Code Client</div>
              <div className="tnum fw-600 text-ink text-[28px] mb-4">{successCode}</div>
            </div>
            <div className="muted text-[13px] mb-6">
              <Ic.Alert /> Le code client est généré. Le client recevra un lien pour configurer son application mobile.
            </div>
            <button type="button" className="btn btn-primary btn-pill w-full justify-center" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-[500px]" onClick={e => e.stopPropagation()}>
        <div className="modal-head brand">
          <div className="title">Nouveau Client KYC</div>
          <button className="btn-icon" aria-label="Fermer" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="modal-body">
          <p className="muted mb-6">Ajouter un nouveau profil client à l'institution.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-start gap-2">
            <span className="mt-0.5"><Ic.Alert /></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="input-group">
              <label htmlFor="client-firstname">Prénom</label>
              <input id="client-firstname" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ex: Jean" disabled={loading} />
            </div>
            <div className="input-group">
              <label htmlFor="client-lastname">Nom</label>
              <input id="client-lastname" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ex: Dupont" disabled={loading} />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="client-phone">Téléphone</label>
            <input id="client-phone" required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: +229 90000000" disabled={loading} />
          </div>

          <div className="input-group">
            <label htmlFor="client-address">Adresse complète</label>
            <input id="client-address" required value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Quartier Haie Vive, Rue 12" disabled={loading} />
          </div>

          <div className="input-group">
            <label htmlFor="client-cni">Numéro de CNI / Passeport</label>
            <input id="client-cni" required value={idCardNumber} onChange={e => setIdCardNumber(e.target.value)} placeholder="Numéro de pièce d'identité" disabled={loading} />
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Création..." : "Enregistrer le client"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
