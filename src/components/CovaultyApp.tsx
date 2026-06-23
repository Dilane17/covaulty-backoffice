"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Sidebar } from "@/components/layout/Sidebar";
import { useTenantStore } from "@/store/tenant.store";
import { institutionService } from "@/services/institution.service";
import { LoginScreen } from "@/components/screens/LoginScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { PlatformDashboardScreen } from "@/components/screens/PlatformDashboardScreen";
import { CollectesScreen } from "@/components/screens/CollectesScreen";
import { TransactionsScreen } from "@/components/screens/TransactionsScreen";
import { MapScreen } from "@/components/screens/MapScreen";
import { AlertesScreen } from "@/components/screens/AlertesScreen";
import { AgentsScreen } from "@/components/screens/AgentsScreen";
import { ClientsScreen } from "@/components/screens/ClientsScreen";
import { AgencesScreen } from "@/components/screens/AgencesScreen";
import { RapportsScreen } from "@/components/screens/RapportsScreen";
import { LiquiditeScreen } from "@/components/screens/LiquiditeScreen";
import { BCEAOScreen } from "@/components/screens/BCEAOScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ProfilScreen } from "@/components/screens/ProfilScreen";
import { SetupPasswordScreen } from "@/components/screens/SetupPasswordScreen";
import { ActionPinModal } from "@/components/modals/ActionPinModal";
import { InstitutionsScreen } from "@/components/screens/InstitutionsScreen";
import { VersementsScreen } from "@/components/screens/VersementsScreen";
import { CreditsScreen } from "@/components/screens/CreditsScreen";
import { PlansEpargneScreen } from "@/components/screens/PlansEpargneScreen";

type RouteId =
  | "login"
  | "setup-password"
  | "institutions"
  | "platform-dashboard"
  | "dashboard"
  | "collectes"
  | "transactions"
  | "map"
  | "alertes"
  | "agents"
  | "clients"
  | "agences"
  | "rapports"
  | "liquidite"
  | "bceao"
  | "versements"
  | "credits"
  | "plans-epargne"
  | "settings"
  | "profil";

const VALID_ROUTES: RouteId[] = [
  "login", "setup-password", "institutions", "platform-dashboard", "dashboard", "collectes", "transactions", "map",
  "alertes", "agents", "clients", "agences", "rapports",
  "liquidite", "bceao", "versements", "credits", "plans-epargne", "settings", "profil"
];

function renderScreen(route: Exclude<RouteId, "login" | "setup-password">): React.ReactNode {
  switch (route) {
    case "institutions":
      return <InstitutionsScreen />;
    case "platform-dashboard":
      return <PlatformDashboardScreen />;
    case "dashboard":
      return <DashboardScreen />;
    case "collectes":
      return <CollectesScreen />;
    case "transactions":
      return <TransactionsScreen />;
    case "map":
      return <MapScreen />;
    case "alertes":
      return <AlertesScreen />;
    case "agents":
      return <AgentsScreen />;
    case "clients":
      return <ClientsScreen />;
    case "agences":
      return <AgencesScreen />;
    case "rapports":
      return <RapportsScreen />;
    case "liquidite":
      return <LiquiditeScreen />;
    case "versements":
      return <VersementsScreen />;
    case "credits":
      return <CreditsScreen />;
    case "plans-epargne":
      return <PlansEpargneScreen />;
    case "bceao":
      return <BCEAOScreen />;
    case "settings":
      return <SettingsScreen />;
    case "profil":
      return <ProfilScreen />;
  }
}

export function CovaultyApp() {
  const [route, setRoute] = useState<RouteId>("login");
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const { institution, isLoading, error, setInstitution, setError, setLoading } = useTenantStore();

  // Tenant Resolution
  useEffect(() => {
    if (!_hasHydrated) return; // Attendre la réhydratation du store auth

    const resolveTenant = async () => {
      let slug: string | null = null;
      try {
        const currentUser = useAuthStore.getState().user;
        const currentAuth = useAuthStore.getState().isAuthenticated;

        // Si l'utilisateur est déjà connecté, son identité JWT fait loi.
        if (currentAuth && currentUser) {
          if (currentUser.role === "SUPER_ADMIN") {
            // Un SUPER_ADMIN n'a pas d'institution par défaut. S'il recharge la page,
            // on ne doit SURTOUT PAS lui forcer l'institution "localhost" de l'URL.
            setInstitution(null, null);
            return;
          } else if (currentUser.institution) {
            // Un admin classique utilise l'institution de son compte, on ignore l'URL.
            useTenantStore.getState().setInstitutionFromUser(currentUser.institution);
            return;
          } else if (currentUser.institutionId) {
            // Si le backend n'a pas inclus l'objet institution complet dans le JWT
            try {
              const res = await institutionService.getAll();
              const inst = Array.isArray(res) ? res[0] : res;
              if (inst) {
                useTenantStore.getState().setInstitutionFromUser(inst);
                useAuthStore.getState().setAuth(useAuthStore.getState().token!, { ...currentUser, institution: inst });
              } else {
                throw new Error("Empty response");
              }
            } catch (err) {
              const fallbackInst = { id: currentUser.institutionId, name: "Mon Institution", slug: "institution" };
              useTenantStore.getState().setInstitutionFromUser(fallbackInst);
              useAuthStore.getState().setAuth(useAuthStore.getState().token!, { ...currentUser, institution: fallbackInst });
            }
            return;
          }
        }

        const hostname = window.location.hostname;
        
        // --- Stratégie de développement (localhost / 127.0.0.1) ---
        const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
        slug = isLocal ? "localhost" : hostname.split(".")[0];
        
        const inst = await institutionService.resolveTenant(slug);
        setInstitution(inst, slug);
      } catch (err) {
        console.warn("Tenant Resolution Failed - Démarrage en contexte Global/SuperAdmin.", err);
        setInstitution(null, slug);
      }
    };

    resolveTenant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  // Route Guard Centralisé
  useEffect(() => {
    if (!_hasHydrated || isLoading || error) return; // Attendre la fin de la réhydratation et du tenant

    
    if (!isAuthenticated && route !== "login" && route !== "setup-password") {
      // Utilisateur non connecté -> accès refusé -> go to login
      window.location.hash = "#login";
    } else if (isAuthenticated && (route === "login" || route === "setup-password") && user) {
      // Utilisateur connecté -> pas besoin de se relogger -> go to home
      if (user.role === "SUPER_ADMIN") {
        window.location.hash = "#platform-dashboard";
      } else if (user.role === "AGENT") {
        window.location.hash = "#collectes";
      } else {
        window.location.hash = "#dashboard";
      }
    }
  }, [route, isAuthenticated, user, institution, _hasHydrated]);

  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace("#", "");
      const baseRoute = fullHash.split("?")[0] as RouteId;
      
      if (baseRoute && VALID_ROUTES.includes(baseRoute)) {
        setRoute(baseRoute);
      } else {
        window.location.hash = "#login";
      }
    };

    // Lire le hash initial au montage
    handleHashChange();

    // Écouter les changements d'URL
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNav = (id: string) => {
    window.location.hash = `#${id}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-(--paper)">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-(--primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--ink-2)">Connexion à votre espace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-(--paper)">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-(--line)">
          <h2 className="text-2xl font-semibold mb-2 text-(--ink-1)">Espace Introuvable</h2>
          <p className="text-(--ink-2) mb-6">{error}</p>
          <p className="text-sm text-(--ink-3)">Vérifiez l'URL ou contactez le support Covaulty.</p>
        </div>
      </div>
    );
  }

  if (route === "login") {
    return <LoginScreen onNav={handleNav} />;
  }

  if (route === "setup-password") {
    return <SetupPasswordScreen onNav={handleNav} />;
  }

  if (isAuthenticated && user && user.role !== "SUPER_ADMIN" && !institution && route !== "login" && route !== "setup-password") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-(--paper)">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-(--line)">
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Erreur Critique</h2>
          <p className="text-(--ink-2) mb-6">Erreur de configuration : institution introuvable. Veuillez vous reconnecter.</p>
          <button className="btn btn-primary btn-pill mx-auto" onClick={() => { useAuthStore.getState().clearAuth(); window.location.hash = "#login"; }}>Se reconnecter</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="shell">
        <Sidebar route={route} onNav={handleNav} />
        <main className="main">
          {renderScreen(route as Exclude<RouteId, "login" | "setup-password">)}
        </main>
      </div>
      <ActionPinModal />
    </>
  );
}
