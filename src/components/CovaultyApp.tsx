"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoginScreen } from "@/components/screens/LoginScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
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

type RouteId =
  | "login"
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
  | "settings"
  | "profil";

function renderScreen(route: Exclude<RouteId, "login">): React.ReactNode {
  switch (route) {
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

  if (route === "login") {
    return <LoginScreen onNav={(id) => setRoute(id as RouteId)} />;
  }

  return (
    <div className="shell">
      <Sidebar route={route} onNav={(id) => setRoute(id as RouteId)} />
      <main className="main">
        {renderScreen(route as Exclude<RouteId, "login">)}
      </main>
    </div>
  );
}
