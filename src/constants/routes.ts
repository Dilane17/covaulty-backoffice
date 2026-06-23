export interface RouteItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  roles?: string[];
}

export interface RouteGroup {
  group: string;
  items: RouteItem[];
}

export const ROUTES: RouteGroup[] = [
  {
    group: "SaaS Admin",
    items: [
      { id: "platform-dashboard", label: "Vue Plateforme", icon: "Home", roles: ["SUPER_ADMIN"] },
      { id: "institutions", label: "Institutions", icon: "Building", roles: ["SUPER_ADMIN"] },
    ],
  },
  {
    group: "Pilotage",
    items: [
      { id: "dashboard",    label: "Vue d'ensemble",    icon: "Home", roles: ["ADMIN", "MANAGER"] },
      { id: "map",          label: "Carte agents",      icon: "Map", roles: ["ADMIN", "MANAGER"] },
      { id: "collectes",    label: "Collectes du jour", icon: "List", roles: ["ADMIN", "MANAGER", "AGENT"] },
      { id: "transactions", label: "Transactions",      icon: "Exchange", roles: ["ADMIN", "MANAGER", "AGENT"] },
      { id: "alertes",      label: "Alertes",           icon: "Bell", count: 3, roles: ["ADMIN", "MANAGER"] },
    ],
  },
  {
    group: "Gestion",
    items: [
      { id: "agents",  label: "Agents",  icon: "Users", roles: ["ADMIN", "MANAGER"] },
      { id: "clients", label: "Clients", icon: "User", roles: ["ADMIN", "MANAGER", "AGENT"] },
      { id: "agences", label: "Agences", icon: "Building", roles: ["ADMIN", "MANAGER"] },
    ],
  },
  {
    group: "Finance",
    items: [
      { id: "versements", label: "Versements",    icon: "Doc", roles: ["ADMIN", "MANAGER"] },
      { id: "credits",    label: "Crédits",       icon: "Building", roles: ["ADMIN", "MANAGER"] },
      { id: "plans-epargne", label: "Plans d'épargne", icon: "Cog", roles: ["ADMIN"] },
      { id: "rapports",  label: "Rapports",     icon: "Chart", roles: ["ADMIN", "MANAGER"] },
      { id: "liquidite", label: "Liquidité",    icon: "Liquid", roles: ["ADMIN", "MANAGER"] },
      { id: "bceao",     label: "Export BCEAO", icon: "Doc", roles: ["ADMIN"] },
    ],
  },
  {
    group: "Paramètres",
    items: [
      { id: "settings", label: "Config système", icon: "Cog", roles: ["SUPER_ADMIN", "ADMIN"] },
    ],
  },
];
