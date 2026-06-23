"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { FieldInput, Row, PermRow } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useTenantStore } from "@/store/tenant.store";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrateur",
  ADMIN: "Administrateur",
  MANAGER: "Superviseur",
  AGENT: "Agent de terrain"
};

const PERMISSIONS = [
  { t: "Voir toutes les collectes", roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "AGENT"] },
  { t: "Accéder aux rapports", roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { t: "Gérer les agents", roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { t: "Exporter les données", roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { t: "Gérer les agences", roles: ["SUPER_ADMIN", "ADMIN"] },
  { t: "Configurer les commissions", roles: ["SUPER_ADMIN", "ADMIN"] },
  { t: "Modifier les paramètres système", roles: ["SUPER_ADMIN", "ADMIN"] },
  { t: "Inviter des utilisateurs admin", roles: ["SUPER_ADMIN"] }
];

export function ProfilScreen() {
  const [tab, setTab] = useState("info");
  
  const user = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clearAuth);
  const institution = useTenantStore(s => s.institution);

  // Action PIN State
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  if (!user) {
    return <div className="p-8 text-center text-(--ink-3)">Non connecté</div>;
  }

  const roleLabel = ROLE_LABELS[user.role] || "Utilisateur";
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Utilisateur";

  const handleSetupPin = async () => {
    setPinError(null);
    if (pin.length < 4) {
      setPinError("Le PIN doit contenir au moins 4 chiffres.");
      return;
    }
    if (pin !== pinConfirm) {
      setPinError("Les codes PIN ne correspondent pas.");
      return;
    }

    setPinLoading(true);
    try {
      await authService.setupActionPin(pin);
      setPinSuccess(true);
      setPinMode(false);
      setPin("");
      setPinConfirm("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setPinError(axiosErr.response?.data?.message || "Erreur lors de la configuration du PIN.");
    } finally {
      setPinLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.hash = "#login";
  };

  return (
    <>
      <Topbar
        crumb={["Mon profil"]}
        title="Profil & Compte"
        badge={<span className="pill role ml-3">{roleLabel}</span>}
      />

      <div className="content grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        <div className="card-xl text-center">
          <div className="relative inline-block mx-auto">
            <div className="av huge bg-(--primary-10) text-(--primary) uppercase tracking-wider">{initials}</div>
          </div>
          <button className="btn btn-ghost btn-sm mt-3.5 mx-auto">
            <Ic.Camera /> Changer la photo
          </button>

          <div className="h2 text-[22px] mt-4.5">{fullName}</div>
          <div className="mt-2"><span className="pill role">{roleLabel}</span></div>
          <div className="muted text-[13px] mt-2">
            {institution ? institution.name : "Institution Globale"} {user.agencyId ? `· Agence ${user.agencyId}` : ""}
          </div>

          <div className="divider" />

          <div className="col gap-10 text-left">
            <Row k="Date d'inscription" v={new Date(user.createdAt || Date.now()).toLocaleDateString("fr-FR")} />
            <Row k="Code Utilisateur" v={user.id.substring(0, 8)} />
            <Row k="Email configuré" v={user.email ? "Oui" : "Non"} />
          </div>

          <div className="divider" />

          <div className="muted text-xs leading-relaxed">
            Dernière connexion enregistrée<br />
            <strong className="text-(--ink)">Aujourd'hui</strong>
          </div>

          <button className="btn btn-ghost-danger w-full justify-center mt-4.5" onClick={handleLogout}>
            <Ic.Logout /> Déconnexion
          </button>
        </div>

        <div>
          <div className="card-xl p-0">
            <div className="tabs-underline px-7">
              {[
                { k: "info",  l: "Informations personnelles" },
                { k: "sec",   l: "Sécurité" },
                { k: "notif", l: "Notifications" },
                { k: "act",   l: "Activité récente" },
              ].map((t) => (
                <button key={t.k} className={`tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
              ))}
            </div>

            <div className="p-7">
              {tab === "info" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldInput k="Prénom" v={user.firstName || ""} />
                    <FieldInput k="Nom" v={user.lastName || ""} />
                    <FieldInput k="Email professionnel" v={user.email || ""} />
                    <FieldInput k="Téléphone" v={user.phone || "-"} />
                    <div className="field">
                      <label htmlFor="profil-agency">Agence principale</label>
                      <div id="profil-agency" className="input bg-(--paper)">
                        {user.agencyId || "Non assigné"}
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="profil-role">Rôle et permissions</label>
                      <div id="profil-role" className="input bg-(--paper)">
                        <span className="pill role">{roleLabel}</span>
                        <span className="muted text-xs ml-auto uppercase tracking-wider">{user.role}</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary mt-5 w-full justify-center">
                    <Ic.Save /> Enregistrer les modifications
                  </button>

                  <div className="bg-(--paper) rounded-[14px] p-5 mt-6">
                    <div className="flex justify-between items-center mb-3.5">
                      <div>
                        <div className="h4">Vos permissions</div>
                        <div className="muted text-xs mt-0.5">Définies par votre rôle</div>
                      </div>
                      <span className="pill role">{roleLabel}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PERMISSIONS.map((p, i) => (
                        <PermRow key={i} ok={p.roles.includes(user.role)} t={p.t} />
                      ))}
                    </div>
                    <div className="muted text-xs mt-3.5 py-2.5 px-3 bg-white rounded-[10px]">
                      Pour modifier vos permissions, contactez un <strong className="text-(--primary)">Super Administrateur</strong>.
                    </div>
                  </div>
                </>
              )}

              {tab === "sec" && (
                <div className="col gap-4">
                  <FieldInput k="Mot de passe actuel" v="••••••••" />
                  <FieldInput k="Nouveau mot de passe" v="" />
                  <div className="bg-(--paper) p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>Authentification à deux facteurs</strong>
                        <div className="muted text-xs mt-0.5">Via SMS au {user.phone || "votre numéro"}</div>
                      </div>
                      <span className="pill good"><Ic.Check /> Activée</span>
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="bg-(--paper) p-5 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong>Code PIN d'Action</strong>
                        <div className="muted text-[13px] mt-1 max-w-[400px]">
                          Code de sécurité exigé avant toute validation ou transfert de fonds.
                        </div>
                      </div>
                      {!pinMode && !pinSuccess && (
                        <button className="btn btn-primary btn-sm" onClick={() => setPinMode(true)}>
                          <Ic.Shield /> Configurer
                        </button>
                      )}
                      {pinSuccess && !pinMode && (
                        <span className="pill good"><Ic.Check /> Configuré</span>
                      )}
                    </div>

                    {pinMode && (
                      <div className="mt-5 bg-white p-4 rounded-lg border border-(--line)">
                        {pinError && (
                          <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-4 border border-red-100 flex items-start gap-2">
                            <span className="mt-0.5"><Ic.Alert /></span>
                            <span>{pinError}</span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="input-group">
                            <label htmlFor="profil-pin">Nouveau PIN (4 à 6 chiffres)</label>
                            <input 
                              id="profil-pin"
                              type="password" 
                              value={pin}
                              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="••••"
                              className="tracking-[4px]"
                              disabled={pinLoading}
                            />
                          </div>
                          <div className="input-group">
                            <label htmlFor="profil-pin-confirm">Confirmer le PIN</label>
                            <input 
                              id="profil-pin-confirm"
                              type="password" 
                              value={pinConfirm}
                              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="••••"
                              className="tracking-[4px]"
                              disabled={pinLoading}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4 justify-end">
                          <button className="btn btn-ghost" onClick={() => setPinMode(false)} disabled={pinLoading}>Annuler</button>
                          <button className="btn btn-primary" onClick={handleSetupPin} disabled={pinLoading || pin.length < 4}>
                            {pinLoading ? "Sauvegarde..." : "Valider le PIN"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab !== "info" && tab !== "sec" && (
                <div className="muted p-10 text-center">Section « {tab} » — en cours de construction</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
