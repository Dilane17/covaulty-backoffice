"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { FieldInput, ColorPicker } from "@/components/ui/Field";
import { Logomark } from "@/components/ui/Logomark";
import { Topbar } from "@/components/layout/Topbar";
import { useTenantStore } from "@/store/tenant.store";
import { useAuthStore } from "@/store/auth.store";

export function SettingsScreen() {
  const { institution, slug } = useTenantStore();
  const user = useAuthStore(s => s.user);

  const [tab, setTab] = useState("identite");
  const [primary, setPrimary] = useState("#B3001B");
  const [secondary, setSecondary] = useState("#255C99");
  const [bg, setBg] = useState("#F6F4F3");
  const [sidebar, setSidebar] = useState("#262626");

  // Synchronise les couleurs si l'institution charge après
  useEffect(() => {
    if (institution?.primaryColor) {
      setPrimary(institution.primaryColor);
    }
  }, [institution]);

  const instName = institution?.name || "Institution Globale";
  const sub = institution?.subdomain || slug || "global";
  const logoUrl = institution?.logoUrl;

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Paramètres système"]}
        title="Paramètres système"
        badge={<span className="pill role ml-3">{user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</span>}
        actions={<button className="btn btn-primary btn-sm" disabled><Ic.Save /> Sauvegarder</button>}
      />

      <div className="tabs-underline bg-white px-7 border-b border-[var(--line)]">
        {[
          { k: "identite",   l: "Identité & White-label" },
          { k: "commission", l: "Commissions" },
          { k: "regles",     l: "Règles métier" },
          { k: "securite",   l: "Sécurité" },
          { k: "notif",      l: "SMS & notifications" },
        ].map((t) => (
          <button key={t.k} className={`tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
        ))}
      </div>

      <div className="content">
        {tab === "identite" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-xl">
              <div className="h3 mb-4.5">Identité de l'institution</div>
              <div className="flex flex-col gap-3.5">
                <FieldInput k="Nom de l'institution" v={instName} />
                <FieldInput k="RCCM" v="Non renseigné" />
                <FieldInput k="Ville / Pays" v="Non renseigné" />
                <FieldInput k="Site web" v="Non renseigné" />
                <FieldInput k="Email contact" v="Non renseigné" />
                <FieldInput k="Téléphone" v="Non renseigné" />

                <div className="field">
                  <label>Logo de l'institution</label>
                  <div className="bg-[var(--paper)] border-2 border-dashed border-[var(--primary-300)] rounded-[14px] p-7 flex flex-col items-center justify-center gap-3.5 text-[var(--ink-3)]">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain mb-2" />
                    ) : (
                      <Ic.Upload />
                    )}
                    <div className="text-[13px] font-medium text-[var(--ink-2)]">Glissez votre logo ici</div>
                    <div className="text-[11px]">PNG, SVG · max 2MB · 512×512 recommandé</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--carbon-deep)] text-white rounded-[22px] p-7 relative overflow-hidden">
              <div className="eyebrow text-white/55 mb-4">Aperçu de l'application</div>
              <div className="h3 text-white mb-1">White-label</div>
              <div className="text-white/60 text-[13px] mb-5">
                Vue temps réel des couleurs et du logo appliqués.
              </div>

              <div className="grid grid-cols-[180px_1fr] gap-4.5 mt-4">
                <div className="bg-black rounded-[22px] p-1.5">
                  <div className="rounded-[18px] p-3.5 h-[290px] flex flex-col" style={{ background: sidebar }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
                    ) : (
                      <Logomark size={22} color={primary} coinColor="#fff" coinStroke={primary} />
                    )}
                    <div className="mt-4 text-[9px] text-white/50 tracking-[0.14em] uppercase">Solde du jour</div>
                    <div className="text-white text-[22px] font-semibold mt-1">12 500 F</div>
                    <div className="mt-3.5 p-2.5 rounded-[10px] bg-white/5 text-[11px] text-white/85">
                      M. Adjovi · 09:12 · 2 000 F
                    </div>
                    <div className="mt-2 p-2.5 rounded-[10px] bg-white/5 text-[11px] text-white/85">
                      Mme Hounkpati · 09:14 · 5 000 F
                    </div>
                    <div className="mt-auto p-2.5 rounded-full text-white text-center text-xs font-medium" style={{ background: primary }}>
                      Nouveau dépôt
                    </div>
                  </div>
                </div>

                <div>
                  <div className="eyebrow text-white/55">Aperçu backoffice</div>
                  <div className="rounded-[10px] mt-2 p-2.5 text-[11px] text-[var(--ink-2)]" style={{ background: bg }}>
                    <div className="flex gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: primary }} />
                      <span className="font-semibold text-[var(--ink)]">Vue d'ensemble</span>
                    </div>
                    <div className="p-2 bg-white rounded-md">
                      <div className="text-[9px] text-[var(--ink-3)]">Encaissé</div>
                      <div className="text-[14px] font-semibold">4 287 500 F</div>
                      <div className="text-[9px] mt-0.5" style={{ color: secondary }}>▲ +18%</div>
                    </div>
                  </div>
                  <button className="pill mt-3.5 border-none bg-[#255C99]/20 text-[#90B6E0]"><Ic.Check /> White-label actif</button>
                </div>
              </div>
            </div>

            <div className="card-xl col-span-1 lg:col-span-2">
              <div className="h3 mb-1">Couleurs & Thème</div>
              <div className="muted text-[13px] mb-5">Tous les composants se synchronisent automatiquement. Le rouge reste l'action ; le bleu reste le signal positif.</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ColorPicker l="Couleur principale"  v={primary}   onChange={setPrimary} />
                <ColorPicker l="Couleur secondaire"  v={secondary} onChange={setSecondary} />
                <ColorPicker l="Couleur de fond"     v={bg}        onChange={setBg} />
                <ColorPicker l="Couleur sidebar"     v={sidebar}   onChange={setSidebar} />
              </div>

              <div className="divider" />

              <div className="eyebrow mb-3">Aperçu en temps réel</div>
              <div className="flex gap-3 items-center flex-wrap">
                <button className="btn btn-pill text-white" style={{ background: primary }}>Bouton primaire</button>
                <button className="btn btn-pill bg-transparent" style={{ borderColor: primary, color: primary }}>Bouton ghost</button>
                <div className="bg-white p-3.5 rounded-xl border border-[var(--line)]" style={{ borderColor: `${primary}30` }}>
                  <div className="eyebrow">Aperçu KPI</div>
                  <div className="tnum text-[22px] font-semibold">4 287 500 F</div>
                  <div className="text-[12px] font-medium mt-0.5" style={{ color: secondary }}>▲ +18,4%</div>
                </div>
              </div>
            </div>

            <div className="card-xl col-span-1 lg:col-span-2">
              <div className="h3 mb-4.5">Domaine personnalisé</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="field">
                  <label htmlFor="settings-subdomain">Sous-domaine Covaulty</label>
                  <div className="input flex" id="settings-subdomain">
                    <span className="mono text-[13px]">{sub}.covaulty.com</span>
                    <span className="pill good ml-auto"><span className="dot" />Actif</span>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="settings-domain">Domaine personnalisé</label>
                  <div className="flex gap-2">
                    <div className="input flex-1"><input id="settings-domain" placeholder={`console.${sub}.com`} /></div>
                    <button className="btn btn-ghost">Configurer DNS</button>
                  </div>
                  <div className="hint">CNAME : <span className="mono">console.{sub}.com → custom.covaulty.com</span></div>
                </div>
              </div>
            </div>

            <div className="card-xl col-span-1 lg:col-span-2 flex gap-3 items-start bg-orange-50/50 border border-orange-100/50">
              <span className="text-orange-500 mt-0.5"><Ic.Alert /></span>
              <div>
                <div className="text-sm font-medium text-orange-800">Modification non disponible</div>
                <div className="text-[13px] text-orange-700/80 mt-1">La modification des informations institution n'est pas encore disponible depuis cette interface.</div>
              </div>
            </div>
          </div>
        )}

        {tab !== "identite" && (
          <div className="card-xl text-center py-20 px-8">
            <div className="muted">Section « {tab} » — en cours de construction</div>
          </div>
        )}
      </div>
    </>
  );
}
