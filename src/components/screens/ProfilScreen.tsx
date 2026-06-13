"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { FieldInput, Row, PermRow } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";

export function ProfilScreen() {
  const [tab, setTab] = useState("info");

  return (
    <>
      <Topbar
        crumb={["Mon profil"]}
        title="Profil & Compte"
        badge={<span className="pill role" style={{ marginLeft: 12 }}>Superviseur</span>}
      />

      <div className="content" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        <div className="card-xl" style={{ textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", margin: "0 auto" }}>
            <div className="av huge">MD</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }}><Ic.Camera /> Changer la photo</button>

          <div className="h2" style={{ fontSize: 22, marginTop: 18 }}>Mme Dossou A.</div>
          <div style={{ marginTop: 8 }}><span className="pill role">Superviseur</span></div>
          <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>COOPEC Akpakpa · Akpakpa</div>

          <div className="divider" />

          <div className="col gap-10" style={{ textAlign: "left" }}>
            <Row k="Connecté depuis" v="3 h" />
            <Row k="Jours actifs"     v="247" />
            <Row k="Rapports générés" v="12" />
          </div>

          <div className="divider" />

          <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
            Dernière connexion<br />
            <strong style={{ color: "var(--ink)" }}>Aujourd&apos;hui · 08:47</strong> · Cotonou, BJ
          </div>

          <button className="btn btn-ghost-danger" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
            <Ic.Logout /> Déconnexion
          </button>
        </div>

        <div>
          <div className="card-xl" style={{ padding: 0 }}>
            <div className="tabs-underline" style={{ padding: "0 28px" }}>
              {[
                { k: "info",  l: "Informations personnelles" },
                { k: "sec",   l: "Sécurité" },
                { k: "notif", l: "Notifications" },
                { k: "act",   l: "Activité récente" },
              ].map((t) => (
                <button key={t.k} className={`tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
              ))}
            </div>

            <div style={{ padding: 28 }}>
              {tab === "info" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FieldInput k="Prénom" v="Adjowa" />
                    <FieldInput k="Nom" v="Dossou" />
                    <FieldInput k="Email professionnel" v="a.dossou@coopec-akpakpa.bj" />
                    <FieldInput k="Téléphone" v="+229 97 12 34 56" />
                    <div className="field">
                      <label>Agence principale</label>
                      <div className="input">
                        <select defaultValue="Akpakpa"><option>Akpakpa</option><option>Cotonou Centre</option></select>
                        <Ic.Chevron />
                      </div>
                    </div>
                    <div className="field">
                      <label>Rôle</label>
                      <div className="input" style={{ background: "var(--paper)" }}>
                        <span className="pill role">Superviseur</span>
                        <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>Lecture seule</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ marginTop: 20, width: "100%", justifyContent: "center" }}>
                    <Ic.Save /> Enregistrer les modifications
                  </button>

                  <div style={{ background: "var(--paper)", borderRadius: 14, padding: 20, marginTop: 24 }}>
                    <div className="between" style={{ marginBottom: 14 }}>
                      <div>
                        <div className="h4">Vos permissions</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Définies par votre rôle</div>
                      </div>
                      <span className="pill role">Superviseur</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <PermRow ok t="Voir toutes les collectes" />
                      <PermRow ok t="Accéder aux rapports" />
                      <PermRow ok t="Gérer les agents" />
                      <PermRow ok t="Exporter les données" />
                      <PermRow t="Modifier les paramètres système" />
                      <PermRow t="Gérer les agences" />
                      <PermRow t="Inviter des utilisateurs admin" />
                      <PermRow t="Configurer les commissions" />
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 14, padding: "10px 12px", background: "#fff", borderRadius: 10 }}>
                      Pour modifier vos permissions, contactez votre <strong style={{ color: "var(--primary)" }}>Super Admin</strong>.
                    </div>
                  </div>
                </>
              )}

              {tab === "sec" && (
                <div className="col gap-16">
                  <FieldInput k="Mot de passe actuel" v="" />
                  <FieldInput k="Nouveau mot de passe" v="" />
                  <div style={{ background: "var(--paper)", padding: 16, borderRadius: 12 }}>
                    <div className="between">
                      <div>
                        <strong>Authentification à deux facteurs</strong>
                        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Via SMS au +229 97 ••• •• 56</div>
                      </div>
                      <span className="pill good"><Ic.Check /> Activée</span>
                    </div>
                  </div>
                </div>
              )}

              {tab !== "info" && tab !== "sec" && (
                <div className="muted" style={{ padding: 40, textAlign: "center" }}>Section « {tab} » — démonstration</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
