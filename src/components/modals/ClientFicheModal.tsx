"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Field } from "@/components/ui/Field";
import { KpiSm } from "@/components/ui/KpiCard";
import { Stars } from "@/components/ui/Stars";
import { LineChart } from "@/components/charts/LineChart";
import { QRCodeSVG } from "qrcode.react";
import { fcfa } from "@/utils/fcfa";
import { Client } from "@/types/client.types";
import { authService } from "@/services/auth.service";
import { clientService } from "@/services/client.service";
import { savingsService } from "@/services/savings.service";
import { collectionService } from "@/services/collection.service";
import { SavingsPlan } from "@/types/savings.types";

interface ClientFicheModalProps {
  r: Client;
  onClose: () => void;
}

export function ClientFicheModal({ r, onClose }: ClientFicheModalProps) {
  const [client, setClient] = useState(r);
  const [tab, setTab] = useState("vue");
  const [loadingToken, setLoadingToken] = useState(false);
  const [setupToken, setSetupToken] = useState<string | null>(null);

  const [showPlanSelect, setShowPlanSelect] = useState(false);
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingTransactions(true);
    // On suppose que collectionService.getTransactions accepte clientId.
    collectionService.getTransactions({ clientId: client.id })
      .then(res => {
        if (mounted) {
          const list = Array.isArray(res) ? res : (res as any).data || [];
          // Les 5 dernières, triées par date la plus récente
          const sorted = list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setTransactions(sorted.slice(0, 5));
        }
      })
      .catch(() => { if(mounted) setTransactions([]) })
      .finally(() => { if(mounted) setLoadingTransactions(false) });
    return () => { mounted = false; };
  }, [client.id]);

  const refreshClient = async () => {
    try {
      const refreshed = await clientService.getById(client.id);
      setClient(refreshed);
    } catch (err) {}
  };

  const handleOpenAccountClick = async () => {
    setShowPlanSelect(true);
    try {
      const res: any = await savingsService.getPlans();
      const planList = Array.isArray(res) ? res : (res.data || []);
      setPlans(planList);
      if (planList.length > 0) setSelectedPlanId(planList[0].id);
    } catch (err) {}
  };

  const handleCreateAccount = async () => {
    if (!selectedPlanId) return;
    setCreatingAccount(true);
    try {
      await savingsService.createAccount({ clientId: client.id, planId: selectedPlanId });
      setShowPlanSelect(false);
      await refreshClient();
    } catch (err) {
      window.alert("Erreur lors de l'ouverture du compte.");
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleGenerateToken = async () => {
    setLoadingToken(true);
    try {
      const res = await authService.generateClientSetupToken(client.id);
      setSetupToken(res.setupToken);
    } catch (err) {
      window.alert("Erreur lors de la génération du token.");
    } finally {
      setLoadingToken(false);
    }
  };

  const isLinked = !!(client.pinHash || client.deviceLinked);
  const hasSavingsAccount = client.savingsAccounts && client.savingsAccounts.length > 0;

  const chart = [
    { x: "J-30", y: 4 }, { x: "J-25", y: 5 }, { x: "J-20", y: 6 }, { x: "J-15", y: 7 },
    { x: "J-10", y: 9 }, { x: "J-5", y: 11 }, { x: "Auj", y: 12.5 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head brand-red">
          <div className="av lg" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
            {(client.firstName[0] || "U")}{(client.lastName?.[0] || "")}
          </div>
          <div style={{ flex: 1 }}>
            <div className="title">{client.firstName} {client.lastName}</div>
            <div className="sub">{client.clientCode || client.id}</div>
          </div>
          <button className="close" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="tabs-underline" style={{ padding: "0 28px" }}>
          {[{ k: "vue", l: "Vue générale" }, { k: "tx", l: "Transactions" }, { k: "kyc", l: "KYC" }, { k: "sig", l: "Signalements" }].map((t) => (
            <button key={t.k} className={`tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
          ))}
        </div>
        <div className="modal-body">
          {tab === "vue" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Informations</div>
                  <div className="col gap-10">
                    <Field k="Téléphone">{client.phone}</Field>
                    <Field k="CNI">{client.idCardNumber || "Non renseignée"}</Field>
                    <Field k="Adresse">{client.address || "Non renseignée"}</Field>
                    <Field k="Statut">
                      <span className="pill good"><Ic.Check /> Actif</span>
                    </Field>
                  </div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Vue financière</div>
                  {hasSavingsAccount ? (
                    <>
                      <div>
                        <div className="tnum" style={{ fontSize: 40, fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                          {fcfa(client.savingsAccounts![0].balance || 0)}
                        </div>
                        <div className="flex gap-2 items-center mt-2">
                          {client.savingsAccounts![0].status !== "CLOSED" ? (
                            <div className="pill good" style={{ display: "inline-flex" }}>
                              <span className="dot" /> Compte épargne actif
                            </div>
                          ) : (
                            <div className="pill muted" style={{ display: "inline-flex" }}>
                              <span className="dot" style={{ background: "var(--ink-4)" }} /> Compte fermé
                            </div>
                          )}
                          {client.savingsAccounts![0].openedAt && (
                            <div className="muted" style={{ fontSize: 12 }}>
                              Ouvert le {new Date(client.savingsAccounts![0].openedAt).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
                        <KpiSm v="1 850 F" l="Dépôt moyen" />
                        <KpiSm v="4.2×/sem" l="Fréquence" />
                      </div>
                    </>
                  ) : (
                    <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: 16, borderRadius: 12 }}>
                      <div className="muted mb-3 text-sm">Le client n'a pas encore de compte épargne actif.</div>
                      
                      {!showPlanSelect ? (
                         <button className="btn btn-primary btn-sm" onClick={handleOpenAccountClick}>
                           Ouvrir un compte épargne
                         </button>
                      ) : (
                         <div className="flex flex-col gap-2">
                           <select 
                             className="input sm w-full" 
                             style={{ padding: "6px 10px", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, height: 36, fontSize: 13, outline: "none" }}
                             value={selectedPlanId} 
                             onChange={(e) => setSelectedPlanId(e.target.value)}
                             disabled={creatingAccount}
                           >
                             {plans.length === 0 && <option value="">Aucun plan disponible</option>}
                             {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.interestRate ? `${p.interestRate}%` : "Libre"})</option>)}
                           </select>
                           <div className="flex gap-2 mt-1">
                             <button className="btn btn-ghost btn-sm" onClick={() => setShowPlanSelect(false)} disabled={creatingAccount}>Annuler</button>
                             <button className="btn btn-primary btn-sm" onClick={handleCreateAccount} disabled={creatingAccount || !selectedPlanId || plans.length === 0}>
                               {creatingAccount ? "Création..." : "Confirmer"}
                             </button>
                           </div>
                         </div>
                      )}
                    </div>
                  )}

                  <div className="eyebrow" style={{ marginTop: 28, marginBottom: 10 }}>Application Mobile</div>
                  <div style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: 16, borderRadius: 12 }}>
                    {isLinked ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="pill good"><Ic.Check /> Smartphone lié</span>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={handleGenerateToken} disabled={loadingToken}>
                        {loadingToken ? (
                          <>Génération...</>
                        ) : (
                          <><Ic.Phone /> Lier un smartphone</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Score crédit comportemental</div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, alignItems: "center" }}>
                  <div style={{ background: "var(--primary-50)", borderRadius: 14, padding: 14, textAlign: "center" }}>
                    <div className="tnum" style={{ fontSize: 32, fontWeight: 600, color: "var(--primary)" }}>{client.creditScore || 5}/5</div>
                    <div className="eyebrow" style={{ marginTop: 2, color: "var(--primary)", fontSize: 10 }}>Excellent</div>
                  </div>
                  <div>
                    <Stars value={client.creditScore || 5} />
                    <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Score calculé basé sur l'historique financier.</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14 }}>
                      <div><div className="tnum fw-600" style={{ fontSize: 16 }}>-</div><div className="eyebrow" style={{ fontSize: 10 }}>Ponctualité</div></div>
                      <div><div className="tnum fw-600" style={{ fontSize: 16 }}>-</div><div className="eyebrow" style={{ fontSize: 10 }}>Incident</div></div>
                      <div><div className="tnum fw-600" style={{ fontSize: 16 }}>-</div><div className="eyebrow" style={{ fontSize: 10 }}>Jours actifs</div></div>
                      <div><div className="tnum fw-600 text-accent" style={{ fontSize: 16 }}>-</div><div className="eyebrow" style={{ fontSize: 10 }}>Vol./mois</div></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>5 dernières transactions</div>
                <div className="col gap-8">
                  {loadingTransactions ? (
                    <div className="muted text-sm py-4">Chargement des transactions...</div>
                  ) : transactions.length === 0 ? (
                    <div className="muted text-sm py-4">Aucune transaction enregistrée.</div>
                  ) : (
                    transactions.map((t, i) => {
                      const p = t.receiptPayload || {};
                      const agentName = p.agentName || "Inconnu";
                      const dateStr = p.date ? new Date(p.date).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : t.createdAt?.substring(0, 10);
                      const amountNum = typeof t.amount === "number" ? t.amount : parseFloat(t.amount as string) || 0;
                      return (
                        <div key={t.id || i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, alignItems: "center", gap: 12 }}>
                          {t.type === "WITHDRAWAL" ? <Ic.ArrowDown /> : <Ic.ArrowUp />}
                          <div>
                            <div className="fw-500">{t.type === "WITHDRAWAL" ? "Retrait" : "Dépôt"} · {agentName}</div>
                            <div className="muted" style={{ fontSize: 11 }}>{dateStr}</div>
                          </div>
                          <div className={`tnum fw-600 ${t.type === "WITHDRAWAL" ? "text-red-600" : "text-accent"}`}>{fcfa(amountNum, { sign: true })}</div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
          {tab !== "vue" && (
            <div className="muted" style={{ padding: 40, textAlign: "center" }}>Section « {tab} » — démonstration</div>
          )}
        </div>
      </div>

      {setupToken && (
        <div className="modal-overlay" onClick={() => setSetupToken(null)} style={{ zIndex: 1000, background: "rgba(0,0,0,0.6)" }}>
          <div className="modal" style={{ maxWidth: 360, textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <div className="modal-head brand" style={{ justifyContent: "center" }}>
              <div className="title" style={{ textAlign: "center", width: "100%" }}>Associer l'application</div>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px" }}>
              <div style={{ background: "#fff", padding: 16, borderRadius: 16, display: "inline-block", border: "1px solid var(--line)" }}>
                <QRCodeSVG value={setupToken} size={200} />
              </div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 24 }}>
                Ce QR code expire dans 15 minutes.<br />
                Demandez au client de le scanner depuis l'application Covaulty.
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 24 }} onClick={() => setSetupToken(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
