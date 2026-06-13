export interface RouteItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

export interface RouteGroup {
  group: string;
  items: RouteItem[];
}

export const ROUTES: RouteGroup[] = [
  {
    group: "Pilotage",
    items: [
      { id: "dashboard",    label: "Vue d'ensemble",    icon: "Home" },
      { id: "map",          label: "Carte agents",      icon: "Map" },
      { id: "collectes",    label: "Collectes du jour", icon: "List" },
      { id: "transactions", label: "Transactions",      icon: "Exchange" },
      { id: "alertes",      label: "Alertes",           icon: "Bell", count: 3 },
    ],
  },
  {
    group: "Gestion",
    items: [
      { id: "agents",  label: "Agents",  icon: "Users" },
      { id: "clients", label: "Clients", icon: "User" },
      { id: "agences", label: "Agences", icon: "Building" },
    ],
  },
  {
    group: "Finance",
    items: [
      { id: "rapports",  label: "Rapports",     icon: "Chart" },
      { id: "liquidite", label: "Liquidité",    icon: "Liquid" },
      { id: "bceao",     label: "Export BCEAO", icon: "Doc" },
    ],
  },
  {
    group: "Paramètres",
    items: [
      { id: "settings", label: "Config système", icon: "Cog" },
    ],
  },
];
