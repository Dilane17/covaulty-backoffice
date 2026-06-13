"use client";

import { ROUTES } from "@/constants/routes";
import { Ic, IcKey } from "@/components/ui/Icons";
import { Logomark } from "@/components/ui/Logomark";

interface SidebarProps {
  route: string;
  onNav: (id: string) => void;
}

export function Sidebar({ route, onNav }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="side-brand">
        <div className="mark"><Logomark size={34} /></div>
        <div>
          <div className="name">Covaulty</div>
          <div className="org">COOPEC Akpakpa</div>
        </div>
      </div>

      {ROUTES.map((g) => (
        <div className="side-group" key={g.group}>
          <div className="side-label">{g.group}</div>
          {g.items.map((it) => {
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
                {it.count && <span className="count">{it.count}</span>}
              </a>
            );
          })}
        </div>
      ))}

      <div className="side-foot">
        <div className="side-user">
          <div className="av">MD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nm" onClick={() => onNav("profil")} style={{ cursor: "pointer" }}>Mme Dossou A.</div>
            <div className="rl">Superviseur</div>
          </div>
          <button className="out" data-tip="Déconnexion"><Ic.Logout /></button>
        </div>
      </div>
    </aside>
  );
}
