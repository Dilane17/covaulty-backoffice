"use client";

import { ReactNode, Fragment } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useTenantStore } from "@/store/tenant.store";

interface TopbarProps {
  crumb?: string[];
  title?: string;
  sub?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}

export function Topbar({ crumb, title, sub, actions, badge }: TopbarProps) {
  const user = useAuthStore(s => s.user);
  const institution = useTenantStore(s => s.institution);

  const superAdminBadge = user?.role === "SUPER_ADMIN" && institution ? (
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-800 px-3 py-1 rounded-full text-[11px] font-medium ml-3">
      <span>Vous administrez : {institution.name}</span>
      <button onClick={() => window.location.hash = "#institutions"} className="text-blue-600 hover:text-blue-800 underline ml-1">Changer</button>
    </div>
  ) : null;
  return (
    <header className="topbar">
      <div className="top-left">
        {crumb && (
          <div className="crumb">
            {crumb.map((c, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="sep">›</span>}
                <span className={i === crumb.length - 1 ? "here" : ""}>{c}</span>
              </Fragment>
            ))}
            {badge}
          </div>
        )}
        {title && <h1 className="h2 flex items-center">{title} {superAdminBadge}</h1>}
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="top-right">{actions}</div>
    </header>
  );
}
