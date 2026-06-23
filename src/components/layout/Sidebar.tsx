"use client";

import { ROUTES } from "@/constants/routes";
import { Ic, IcKey } from "@/components/ui/Icons";
import { Logomark } from "@/components/ui/Logomark";
import { useAuthStore } from "@/store/auth.store";
import { useTenantStore } from "@/store/tenant.store";
import { alertService } from "@/services/alert.service";
import { useState, useEffect } from "react";

interface SidebarProps {
  route: string;
  onNav: (id: string) => void;
}

export function Sidebar({ route, onNav }: SidebarProps) {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const institution = useTenantStore((s) => s.institution);

  const handleLogout = () => {
    clearAuth();
    window.location.hash = "#login";
  };

  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchAlerts = async () => {
      try {
        const alerts = await alertService.getAlerts("OPEN");
        const list = Array.isArray(alerts) ? alerts : ((alerts as any).data || []);
        setAlertCount(list.length);
      } catch (err) {}
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <div className="mark"><Logomark size={34} /></div>
        <div>
          <div className="name">Covaulty</div>
          <div className="org">{institution ? institution.name : "Plateforme globale"}</div>
        </div>
      </div>

      {ROUTES.map((g) => {
        const visibleItems = g.items.filter((it) => !it.roles || (user && it.roles.includes(user.role)));
        if (visibleItems.length === 0) return null;

        return (
          <div className="side-group" key={g.group}>
            <div className="side-label">{g.group}</div>
            {visibleItems.map((it) => {
              const IconC = Ic[it.icon as IcKey];
              return (
                <a
                  key={it.id}
                  className={`side-link ${route === it.id ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); onNav(it.id); }}
                  href={`#${it.id}`}
                >
                  <span className="ic"><IconC /></span>
                  <span>{it.label}</span>
                  {it.id === "alertes" ? (
                    alertCount > 0 ? (
                      <span className="count bg-red-500 text-white border-none">{alertCount}</span>
                    ) : null
                  ) : it.count ? (
                    <span className="count">{it.count}</span>
                  ) : null}
                </a>
              );
            })}
          </div>
        );
      })}

      <div className="side-foot">
        <div className="side-user">
          <div className="av">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nm" onClick={() => onNav("profil")} style={{ cursor: "pointer" }}>{user?.firstName} {user?.lastName}</div>
            <div className="rl">{user?.role}</div>
          </div>
          <button className="out" data-tip="Déconnexion" onClick={handleLogout}><Ic.Logout /></button>
        </div>
      </div>
    </aside>
  );
}
